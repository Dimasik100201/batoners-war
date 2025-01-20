export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Card {
  id: string;
  name: string;
  description: string;
  rarity: CardRarity;
  baseIncome: number;
  level: number;
  cooldown: number; // в секундах
  lastCollected: number; // timestamp
  cost: number;
}

export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  rarity: CardRarity;
  baseIncome: number;
  cooldown: number;
  cost: number;
} 