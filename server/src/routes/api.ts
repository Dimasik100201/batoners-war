import express from 'express';
import { auth, rateLimiter } from '../middleware/auth';
import {
  loginUser,
  saveProgress,
  getLeaderboard,
  updateAchievements,
  getProfile
} from '../controllers/userController';

const router = express.Router();

// Публичные маршруты
router.post('/login', loginUser);
router.get('/leaderboard', getLeaderboard);

// Защищенные маршруты
router.use(auth);
router.use(rateLimiter);

router.get('/profile', getProfile);
router.post('/save-progress', saveProgress);
router.post('/achievements', updateAchievements);

export default router; 