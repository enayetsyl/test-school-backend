// src/middleware/seb.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { AppError } from '../utils/error';

declare module 'express-serve-static-core' {
  interface Request {
    sebHeadersPresent?: boolean;
  }
}

/** Minimal SEB guard: in `block` mode, required headers must be present; in `warn`, we allow through. */
export function requireSebHeaders(req: Request, _res: Response, next: NextFunction) {
  const cfg = env.SEB_MODE; // 'block' | 'warn'
  const present = Boolean(
    req.headers['x-safe-exam-browser-configkeyhash'] ||
      req.headers['x-safe-exam-browser-requesthash'],
  );
  req.sebHeadersPresent = present;

  if (cfg === 'block' && !present) {
    throw new AppError('FORBIDDEN', 'Safe Exam Browser required', 403);
  }
  return next();
}
