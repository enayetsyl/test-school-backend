// src/models/systemConfig.ts
import { Schema, model } from 'mongoose';
const SystemConfigSchema = new Schema({
    _id: { type: String, default: 'singleton' }, // keep it single-document
    timePerQuestionSec: { type: Number, default: 90, min: 30, max: 300 },
    retakeLockMinutes: { type: Number, default: 60, min: 0, max: 24 * 60 },
    maxRetakes: { type: Number, default: 3, min: 0, max: 10 },
    sebMode: { type: String, enum: ['off', 'warn', 'enforce'], default: 'warn' },
}, { timestamps: true, versionKey: false });
export const SystemConfig = model('SystemConfig', SystemConfigSchema);
// Helper for callers that need config with sensible defaults
export async function loadSystemConfig() {
    const existing = await SystemConfig.findById('singleton');
    if (existing)
        return existing;
    return SystemConfig.create({ _id: 'singleton' });
}
