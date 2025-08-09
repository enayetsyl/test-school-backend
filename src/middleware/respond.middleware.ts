// src/middleware/respond.middleware.ts
import type { NextFunction, Response, Request } from 'express';
import type { Meta } from '../types/api';

declare module 'express-serve-static-core' {
  interface Response {
    ok: <T>(data: T, message?: string, meta?: Meta) => Response;
    created: <T>(data: T, message?: string, meta?: Meta) => Response;
    noContent: () => Response;
    paginated: <T>(
      items: T[],
      meta: { page: number; limit: number; total: number },
      message?: string,
    ) => Response;
  }
}

export function respondMiddleware(_req: Request, res: Response, next: NextFunction) {
  res.ok = function <T>(data: T, message?: string, meta?: Meta) {
    return this.status(200).json({
      success: true,
      data,
      ...(message && { message }),
      ...(meta && { meta }),
    });
  };
  res.created = function <T>(data: T, message?: string, meta?: Meta) {
    return this.status(201).json({
      success: true,
      data,
      ...(message && { message }),
      ...(meta && { meta }),
    });
  };
  res.noContent = function () {
    return this.status(204).end();
  };
  res.paginated = function <T>(
    items: T[],
    meta: { page: number; limit: number; total: number },
    message?: string,
  ) {
    return this.status(200).json({ success: true, data: items, ...(message && { message }), meta });
  };
  next();
}
