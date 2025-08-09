// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
export const authLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, code: 'RATE_LIMITED', message: 'Too many requests, slow down.' },
});
