// src/middleware/rbac.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import type { AccessTokenPayload } from '../utils/jwt';
import { AppError } from '../utils/error';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AccessTokenPayload;
  }
}

export function requireRole(...roles: AccessTokenPayload['role'][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError('UNAUTHORIZED', 'Login required', 401);
    if (!roles.includes(req.user.role)) throw new AppError('FORBIDDEN', 'Insufficient role', 403);
    next();
  };
}
