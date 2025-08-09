// src/models/RefreshToken.ts
import { Schema, model } from 'mongoose';
const RefreshTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date },
    ip: { type: String },
    userAgent: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });
RefreshTokenSchema.index({ userId: 1, tokenHash: 1 }, { unique: true });
export const RefreshToken = model('RefreshToken', RefreshTokenSchema);
