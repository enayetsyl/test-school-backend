// src/models/Question.ts
import { Schema, model } from 'mongoose';
import type { Types, HydratedDocument } from 'mongoose';

export type OtpPurpose = 'verify' | 'reset';

export interface IOtpToken extends Document {
  userId: Types.ObjectId;
  channel: 'email';
  otpHash: string;
  purpose: OtpPurpose;
  expiresAt: Date; // TTL
  consumedAt?: Date;
  createdAt: Date;
}

export type OtpTokenDoc = HydratedDocument<IOtpToken>;

const OtpTokenSchema = new Schema<IOtpToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    channel: { type: String, enum: ['email'], default: 'email' },
    otpHash: { type: String, required: true },
    purpose: { type: String, enum: ['verify', 'reset'], required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    consumedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// TTL index (Mongo will purge expired)
OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpToken = model<IOtpToken>('OtpToken', OtpTokenSchema);
