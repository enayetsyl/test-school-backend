// src/models/User.ts
import { Schema, model } from 'mongoose';
import type { Types, HydratedDocument } from 'mongoose';

export type UserRole = 'admin' | 'student' | 'supervisor';
export type UserStatus = 'active' | 'inactive';

export interface IUser extends Document {
  _id: string | Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  passwordHash: string;
  emailVerified: boolean;
  status: UserStatus;
  isLockedFromStep1?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDoc = HydratedDocument<IUser>;
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ['admin', 'student', 'supervisor'],
      default: 'student',
      index: true,
    },
    passwordHash: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
    isLockedFromStep1: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', UserSchema);
