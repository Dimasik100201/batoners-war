import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Пожалуйста, авторизуйтесь' });
  }
};

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  // Простая защита от спама
  const requestsPerMinute = 100;
  const now = Date.now();
  const minute = 60 * 1000;

  if (!global.requestCounts) {
    global.requestCounts = new Map();
  }

  const userKey = req.user?.telegramId || req.ip;
  const userRequests = global.requestCounts.get(userKey) || [];

  // Удаляем старые запросы
  const recentRequests = userRequests.filter((time: number) => now - time < minute);

  if (recentRequests.length >= requestsPerMinute) {
    return res.status(429).json({ error: 'Слишком много запросов. Пожалуйста, подождите.' });
  }

  recentRequests.push(now);
  global.requestCounts.set(userKey, recentRequests);

  next();
}; 