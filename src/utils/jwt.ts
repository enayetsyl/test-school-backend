// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';

import { env } from '../config/env';

type JwtId = string; // you can switch to UUID if you want jti tracking later

export interface AccessTokenPayload {
  sub: string; // userId
  role: 'admin' | 'student' | 'supervisor';
  jti?: JwtId;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: JwtId; // always present for rotation/revocation lists
  typ: 'refresh';
}

const accessSecret: Secret = env.JWT_ACCESS_SECRET as string;
const refreshSecret: Secret = env.JWT_REFRESH_SECRET as string;
const accessExpire: NonNullable<SignOptions['expiresIn']> =
  env.JWT_ACCESS_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>;
const refreshExpire: NonNullable<SignOptions['expiresIn']> =
  env.JWT_REFRESH_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>;

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, accessSecret, {
    expiresIn: accessExpire,
  });
}

export function signRefreshToken(payload: Omit<RefreshTokenPayload, 'typ'>): string {
  return jwt.sign({ ...payload, typ: 'refresh' }, refreshSecret, { expiresIn: refreshExpire });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  if (decoded.typ !== 'refresh') {
    throw new Error('Invalid token type');
  }
  return decoded;
}
