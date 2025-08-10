// src/models/systemConfig.ts
import { Schema, model, type Document } from 'mongoose';

export type SebMode = 'off' | 'warn' | 'enforce';

export interface SystemConfigAttrs {
  timePerQuestionSec: number; // per question timer
  retakeLockMinutes: number; // lockout if Step-1 < threshold, etc.
  maxRetakes: number; // optional policy if you add it later
  sebMode: SebMode; // off | warn | enforce
}

export interface SystemConfigDoc extends Document, SystemConfigAttrs {
  _id: string; // "singleton"
  createdAt: Date;
  updatedAt: Date;
}

const SystemConfigSchema = new Schema<SystemConfigDoc>(
  {
    _id: { type: String, default: 'singleton' }, // keep it single-document
    timePerQuestionSec: { type: Number, default: 90, min: 30, max: 300 },
    retakeLockMinutes: { type: Number, default: 60, min: 0, max: 24 * 60 },
    maxRetakes: { type: Number, default: 3, min: 0, max: 10 },
    sebMode: { type: String, enum: ['off', 'warn', 'enforce'], default: 'warn' },
  },
  { timestamps: true, versionKey: false },
);

export const SystemConfig = model<SystemConfigDoc>('SystemConfig', SystemConfigSchema);

// Helper for callers that need config with sensible defaults
export async function loadSystemConfig(): Promise<SystemConfigDoc> {
  const existing = await SystemConfig.findById('singleton');
  if (existing) return existing;
  return SystemConfig.create({ _id: 'singleton' });
}
