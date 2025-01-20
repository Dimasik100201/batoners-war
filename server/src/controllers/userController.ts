import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { telegramId, username } = req.body;

    let user = await User.findOne({ telegramId });

    if (!user) {
      // Создаем нового пользователя с начальными данными
      user = new User({
        telegramId,
        username,
        skins: [
          {
            id: 'common',
            name: 'Обычный батон',
            rarity: 'common',
            owned: true
          }
        ]
      });
      await user.save();
    }

    const token = jwt.sign({ telegramId }, JWT_SECRET, { expiresIn: '30d' });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const saveProgress = async (req: Request, res: Response) => {
  try {
    const { telegramId } = req.user;
    const updateData = req.body;

    const user = await User.findOneAndUpdate(
      { telegramId },
      { 
        ...updateData,
        lastActive: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { league = 'bronze', limit = 100 } = req.query;

    const leaderboard = await User.find({ currentLeague: league })
      .sort({ batons: -1 })
      .limit(Number(limit))
      .select('username batons currentLeague');

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const updateAchievements = async (req: Request, res: Response) => {
  try {
    const { telegramId } = req.user;
    const { achievements } = req.body;

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Обновляем прогресс достижений
    achievements.forEach((achievement: any) => {
      const existingAchievement = user.achievements.find(a => a.id === achievement.id);
      if (existingAchievement) {
        existingAchievement.progress = achievement.progress;
        if (achievement.completed && !existingAchievement.completed) {
          existingAchievement.completed = true;
          existingAchievement.completedAt = new Date();
        }
      } else {
        user.achievements.push(achievement);
      }
    });

    await user.save();
    res.json(user.achievements);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { telegramId } = req.user;
    const user = await User.findOne({ telegramId });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}; 