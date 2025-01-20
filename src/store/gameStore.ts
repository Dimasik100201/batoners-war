import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from '../services/api';
import { Card, CardTemplate } from '../types/cards';

// Шаблоны карточек
const cardTemplates: CardTemplate[] = [
  {
    id: 'baker',
    name: 'Пекарь',
    description: 'Печёт батоны с любовью',
    rarity: 'common',
    baseIncome: 1,
    cooldown: 10,
    cost: 10
  },
  {
    id: 'bakery',
    name: 'Пекарня',
    description: 'Маленькая уютная пекарня',
    rarity: 'rare',
    baseIncome: 5,
    cooldown: 30,
    cost: 50
  },
  {
    id: 'factory',
    name: 'Фабрика',
    description: 'Промышленное производство батонов',
    rarity: 'epic',
    baseIncome: 20,
    cooldown: 60,
    cost: 200
  }
];

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type League = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';

interface Card {
  id: string;
  name: string;
  level: number;
  passiveIncome: number;
  cooldown: number;
  lastCollected: number;
}

interface Skin {
  id: string;
  name: string;
  rarity: Rarity;
  price: number;
  owned: boolean;
}

const defaultSkins: Skin[] = [
  {
    id: 'common',
    name: 'Обычный батон',
    rarity: 'common',
    price: 0,
    owned: true
  },
  {
    id: 'rare',
    name: 'Французский багет',
    rarity: 'rare',
    price: 1000,
    owned: false
  },
  {
    id: 'epic',
    name: 'Радужный батон',
    rarity: 'epic',
    price: 10000,
    owned: false
  },
  {
    id: 'legendary',
    name: 'Золотой батон',
    rarity: 'legendary',
    price: 100000,
    owned: false
  }
];

interface GameState {
  // Состояние игры
  telegramId: string | null;
  username: string | null;
  batons: number;
  batonsPerClick: number;
  passiveIncome: number;
  cards: Card[];
  skins: Skin[];
  currentLeague: League;
  currentSkin: string;
  isInitialized: boolean;
  isSyncing: boolean;
  lastSyncTime: number;
  
  // Действия
  initialize: (telegramId: string, username: string) => Promise<void>;
  sync: () => Promise<void>;
  addBatons: (amount: number) => void;
  spendBatons: (amount: number) => boolean;
  collectPassiveIncome: () => void;
  upgradeCard: (cardId: string) => void;
  purchaseSkin: (skinId: string) => void;
  equipSkin: (skinId: string) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      telegramId: null,
      username: null,
      batons: 0,
      batonsPerClick: 1,
      passiveIncome: 0,
      cards: [],
      skins: defaultSkins,
      currentLeague: 'bronze',
      currentSkin: 'common',
      isInitialized: false,
      isSyncing: false,
      lastSyncTime: 0,

      // Инициализация игры
      initialize: async (telegramId: string, username: string) => {
        try {
          const user = await api.login(telegramId, username);
          set({
            telegramId,
            username,
            ...user,
            isInitialized: true
          });

          // Запускаем автоматическую синхронизацию
          api.startAutoSync((data) => {
            set((state) => ({
              ...state,
              ...data,
              lastSyncTime: Date.now()
            }));
          });
        } catch (error) {
          console.error('Ошибка инициализации:', error);
        }
      },

      // Синхронизация с сервером
      sync: async () => {
        const state = get();
        if (state.isSyncing) return;

        set({ isSyncing: true });
        try {
          const progress = {
            batons: state.batons,
            batonsPerClick: state.batonsPerClick,
            passiveIncome: state.passiveIncome,
            cards: state.cards,
            skins: state.skins,
            currentLeague: state.currentLeague,
            currentSkin: state.currentSkin
          };

          const updatedState = await api.saveProgress(progress);
          set({
            ...updatedState,
            lastSyncTime: Date.now()
          });
        } catch (error) {
          console.error('Ошибка синхронизации:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      addBatons: (amount) => {
        set((state) => {
          const newState = {
            ...state,
            batons: state.batons + amount
          };
          api.autoSave(newState);
          return newState;
        });
      },
      
      spendBatons: (amount) => {
        const state = get();
        if (state.batons >= amount) {
          set((state) => {
            const newState = {
              ...state,
              batons: state.batons - amount
            };
            api.autoSave(newState);
            return newState;
          });
          return true;
        }
        return false;
      },

      collectPassiveIncome: () => {
        const state = get();
        const now = Date.now();
        let totalIncome = 0;

        state.cards.forEach(card => {
          const timePassed = now - card.lastCollected;
          if (timePassed >= card.cooldown) {
            totalIncome += card.passiveIncome;
          }
        });

        if (totalIncome > 0) {
          set((state) => {
            const newState = {
              ...state,
              batons: state.batons + totalIncome,
              cards: state.cards.map(card => ({
                ...card,
                lastCollected: now
              }))
            };
            api.autoSave(newState);
            return newState;
          });
        }
      },

      upgradeCard: (cardId) => {
        set((state) => {
          const newState = {
            ...state,
            cards: state.cards.map(card =>
              card.id === cardId
                ? {
                    ...card,
                    level: card.level + 1,
                    passiveIncome: card.passiveIncome * 1.5
                  }
                : card
            )
          };
          api.autoSave(newState);
          return newState;
        });
      },

      purchaseSkin: (skinId) => {
        const state = get();
        const skin = state.skins.find(s => s.id === skinId);
        
        if (skin && !skin.owned && state.spendBatons(skin.price)) {
          set((state) => {
            const newState = {
              ...state,
              skins: state.skins.map(s =>
                s.id === skinId ? { ...s, owned: true } : s
              )
            };
            api.autoSave(newState);
            return newState;
          });
        }
      },

      equipSkin: (skinId) => {
        const state = get();
        const skin = state.skins.find(s => s.id === skinId);
        if (skin && skin.owned) {
          set((state) => {
            const newState = {
              ...state,
              currentSkin: skinId
            };
            api.autoSave(newState);
            return newState;
          });
        }
      },
    }),
    {
      name: 'batoners-war-storage',
      partialize: (state) => ({
        batons: state.batons,
        batonsPerClick: state.batonsPerClick,
        passiveIncome: state.passiveIncome,
        cards: state.cards,
        skins: state.skins,
        currentLeague: state.currentLeague,
        currentSkin: state.currentSkin
      })
    }
  )
);

// Запускаем пассивный доход
setInterval(() => {
  const { collectPassiveIncome } = useGameStore.getState();
  collectPassiveIncome();
}, 1000); 