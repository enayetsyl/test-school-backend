// src/services/auth.service.ts
import crypto from 'node:crypto';
import { Types } from 'mongoose';
import { User } from '../models/User';
import { OtpToken } from '../models/OtpToken';
import { RefreshToken } from '../models/RefreshToken';
import { hashPassword, comparePassword } from '../utils/hasher';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type AccessTokenPayload,
} from '../utils/jwt';
import { sendOtpEmail, sendResetConfirmation } from './mailer.service';
import { AppError } from '../utils/error';
import { env } from '../config/env';

function hashRefreshForDB(token: string) {
  // Use a fast, one-way hash for DB storage (not bcrypt – we just need lookup)
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function registerUser(params: { name: string; email: string; password: string }) {
  const exists = await User.findOne({ email: params.email });
  if (exists) throw new AppError('CONFLICT', 'Email already registered', 409);

  const passwordHash = await hashPassword(params.password);
  const user = await User.create({
    name: params.name,
    email: params.email,
    passwordHash,
    role: 'student',
    emailVerified: false,
    status: 'active',
  });
  // send verification OTP (optional)
  const otp = await issueOtp(user._id.toString(), 'verify');
  await sendOtpEmail(user.email, otp, 'verify');

  return user;
}

export async function loginUser(params: { email: string; password: string }) {
  const user = await User.findOne({ email: params.email });
  if (!user) throw new AppError('UNAUTHORIZED', 'Invalid credentials', 401);
  if (user.status !== 'active') throw new AppError('FORBIDDEN', 'Account disabled', 403);

  const ok = await comparePassword(params.password, user.passwordHash);
  if (!ok) throw new AppError('UNAUTHORIZED', 'Invalid credentials', 401);

  const tokens = await issueTokens(user._id.toString(), user.role);
  return { user, ...tokens };
}

export async function issueTokens(userId: string, role: AccessTokenPayload['role']) {
  const jti = crypto.randomUUID();
  const access = signAccessToken({ sub: userId, role, jti });

  const refreshJti = crypto.randomUUID();
  const refresh = signRefreshToken({ sub: userId, jti: refreshJti });
  const tokenHash = hashRefreshForDB(refresh);
  const expiresAt = new Date(Date.now() + parseExpiryMs(env.JWT_REFRESH_EXPIRES_IN));

  await RefreshToken.create({
    userId: new Types.ObjectId(userId),
    tokenHash,
    expiresAt,
  });

  return { accessToken: access, refreshToken: refresh };
}

export async function rotateRefreshToken(rawToken: string) {
  const decoded = verifyRefreshToken(rawToken); // throws if invalid or wrong typ
  const tokenHash = hashRefreshForDB(rawToken);

  // Check not revoked/expired in DB
  const doc = await RefreshToken.findOne({ userId: decoded.sub, tokenHash });
  if (!doc || doc.revokedAt || doc.expiresAt < new Date()) {
    throw new AppError('UNAUTHORIZED', 'Invalid refresh token', 401);
  }

  // Revoke old & issue new pair
  doc.revokedAt = new Date();
  await doc.save();

  const user = await User.findById(decoded.sub);
  if (!user) throw new AppError('UNAUTHORIZED', 'User not found', 401);

  return issueTokens(user._id.toString(), user.role);
}

export async function logoutUser(rawToken?: string) {
  if (!rawToken) return;
  const tokenHash = hashRefreshForDB(rawToken);
  await RefreshToken.updateMany(
    { tokenHash, revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() } },
  );
}

export async function issueOtp(userId: string, purpose: 'verify' | 'reset') {
  const otp = generateOtp(6);
  const otpHash = await hashPassword(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await OtpToken.create({
    userId: new Types.ObjectId(userId),
    channel: 'email',
    otpHash,
    purpose,
    expiresAt,
  });

  return otp;
}

export async function sendOtp(email: string, purpose: 'verify' | 'reset') {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('NOT_FOUND', 'User not found', 404);

  const otp = await issueOtp(user._id.toString(), purpose);
  await sendOtpEmail(user.email, otp, purpose);
  return { sent: true };
}

export async function verifyOtp(email: string, otp: string, purpose: 'verify' | 'reset') {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('NOT_FOUND', 'User not found', 404);

  console.log('email otp purpose', email, otp, purpose);

  const record = await OtpToken.findOne({
    userId: user._id,
    purpose,
    consumedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  console.log('record', record);
  if (!record) throw new AppError('UNAUTHORIZED', 'OTP expired or not found', 401);

  const ok = await comparePassword(otp, record.otpHash);
  if (!ok) throw new AppError('UNAUTHORIZED', 'Invalid OTP', 401);

  record.consumedAt = new Date();
  await record.save();

  if (purpose === 'verify') {
    user.emailVerified = true;
    await user.save();
  }

  return { verified: true };
}

export async function forgotPassword(email: string) {
  const user = await User.findOne({ email });
  if (!user) return { sent: true }; // do not leak existence

  const otp = await issueOtp(user._id.toString(), 'reset');
  await sendOtpEmail(user.email, otp, 'reset');
  return { sent: true };
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('NOT_FOUND', 'User not found', 404);

  // verify OTP with purpose reset
  const res = await verifyOtp(email, otp, 'reset');
  if (!res.verified) throw new AppError('UNAUTHORIZED', 'Invalid OTP', 401);

  const passwordHash = await hashPassword(newPassword);
  user.passwordHash = passwordHash;
  await user.save();

  // revoke all refresh tokens
  await RefreshToken.updateMany(
    { userId: user._id, revokedAt: { $exists: false } },
    { $set: { revokedAt: new Date() } },
  );
  await sendResetConfirmation(user.email);

  return { reset: true };
}

function generateOtp(len: number) {
  const bytes = crypto.randomBytes(len);
  return Array.from(bytes, (b) => (b % 10).toString()).join('');
}

function parseExpiryMs(v: string | number): number {
  if (typeof v === 'number') return v * 1000; // if number, assume seconds
  // allow "7d", "15m", "3600" etc — jsonwebtoken accepts these but our env is validated as string|number
  // here we just handle simple cases; fallback to seconds
  const m = /^(\d+)([smhd])?$/.exec(v);
  if (!m) return Number(v) * 1000;

  const n = Number(m[1]);
  const unit = (m[2] ?? 's') as 's' | 'm' | 'h' | 'd';
  const map: Record<'s' | 'm' | 'h' | 'd', number> = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  return n * map[unit];
}
