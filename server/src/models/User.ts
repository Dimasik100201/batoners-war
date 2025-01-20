import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  telegramId: string;
  username: string;
  batons: number;
  batonsPerClick: number;
  passiveIncome: number;
  currentLeague: string;
  currentSkin: string;
  cards: Array<{
    id: string;
    name: string;
    level: number;
    passiveIncome: number;
    cooldown: number;
    lastCollected: number;
  }>;
  skins: Array<{
    id: string;
    name: string;
    rarity: string;
    owned: boolean;
  }>;
  achievements: Array<{
    id: string;
    completed: boolean;
    progress: number;
    completedAt?: Date;
  }>;
  lastActive: Date;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  batons: { type: Number, default: 0 },
  batonsPerClick: { type: Number, default: 1 },
  passiveIncome: { type: Number, default: 0 },
  currentLeague: { type: String, default: 'bronze' },
  currentSkin: { type: String, default: 'common' },
  cards: [{
    id: String,
    name: String,
    level: Number,
    passiveIncome: Number,
    cooldown: Number,
    lastCollected: Number
  }],
  skins: [{
    id: String,
    name: String,
    rarity: String,
    owned: Boolean
  }],
  achievements: [{
    id: String,
    completed: Boolean,
    progress: Number,
    completedAt: Date
  }],
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Индексы для оптимизации запросов
UserSchema.index({ telegramId: 1 });
UserSchema.index({ batons: -1 });
UserSchema.index({ currentLeague: 1, batons: -1 });

export default mongoose.model<IUser>('User', UserSchema); 