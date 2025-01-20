import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/batoners-war';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Логгер запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Маршруты API
app.use('/api', apiRoutes);

// Обработка ошибок
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

// Подключение к MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Подключено к MongoDB');
    
    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
    process.exit(1);
  });

// Обработка сигналов завершения
process.on('SIGTERM', () => {
  console.log('Получен сигнал SIGTERM. Закрытие сервера...');
  mongoose.connection.close()
    .then(() => {
      console.log('MongoDB соединение закрыто');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Ошибка закрытия MongoDB соединения:', error);
      process.exit(1);
    });
}); 