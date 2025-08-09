// src/models/RefreshToken.ts
import { Schema, model } from 'mongoose';
import type { Types, HydratedDocument } from 'mongoose';

export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  tokenHash: string; // store hash, never raw token
  expiresAt: Date;
  revokedAt?: Date;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

export type RefreshTokenDoc = HydratedDocument<IRefreshToken>;

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

RefreshTokenSchema.index({ userId: 1, tokenHash: 1 }, { unique: true });

export const RefreshToken = model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
