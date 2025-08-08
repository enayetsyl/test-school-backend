// src/utils/cookies.ts
import type { Request, Response } from 'express';
import { env, isProd } from '../config/env';

const REFRESH_COOKIE_NAME = 'rt';

export function setRefreshCookie(res: Response, token: string) {
  if (env.AUTH_REFRESH_TRANSPORT !== 'cookie') return;

  // 7d default; but we don’t compute maxAge here from env string — use a safe hard cap or parse if you prefer.
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/v1/auth/token', // narrowest path that still works for refresh route
    maxAge: sevenDaysMs,
  });
}

export function clearRefreshCookie(res: Response) {
  if (env.AUTH_REFRESH_TRANSPORT !== 'cookie') return;
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/v1/auth/token',
  });
}

export function readRefreshFromCookieOrHeader(req: Request): string | undefined {
  if (env.AUTH_REFRESH_TRANSPORT === 'cookie') {
    return req.cookies?.rt;
  }
  // header transport: Authorization: Bearer <refreshToken>
  const auth = req.get('authorization') ?? '';
  const [, token] = auth.split(' ');
  return token;
}
