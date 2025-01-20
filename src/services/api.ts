import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://batoners-war-api.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (telegramId: string, username: string) => {
  const response = await api.post('/login', { telegramId, username });
  const { token, user } = response.data;
  localStorage.setItem('token', token);
  return user;
};

export const saveProgress = async (progress: any) => {
  const response = await api.post('/save-progress', progress);
  return response.data;
};

export const getLeaderboard = async (league: string = 'bronze', limit: number = 100) => {
  const response = await api.get('/leaderboard', {
    params: { league, limit }
  });
  return response.data;
};

export const updateAchievements = async (achievements: any[]) => {
  const response = await api.post('/achievements', { achievements });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

// Автоматическое сохранение прогресса
let saveTimeout: NodeJS.Timeout | null = null;
const SAVE_DELAY = 5000; // 5 секунд

export const autoSave = (progress: any) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    saveProgress(progress).catch(console.error);
  }, SAVE_DELAY);
};

// Периодическая синхронизация с сервером
const SYNC_INTERVAL = 30000; // 30 секунд

export const startAutoSync = (onSync: (data: any) => void) => {
  const syncInterval = setInterval(async () => {
    try {
      const profile = await getProfile();
      onSync(profile);
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
    }
  }, SYNC_INTERVAL);

  return () => clearInterval(syncInterval);
};

export default api; 