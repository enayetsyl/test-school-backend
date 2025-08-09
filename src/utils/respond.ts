// src/utils/respond.ts
import type { Response } from 'express';
import type { ApiSuccess, Meta } from '../types/api';

export function sendOk<T>(res: Response, data: T, message?: string, meta?: Meta) {
  const body: ApiSuccess<T> = {
    success: true,
    data,
    ...(message && { message }),
    ...(meta && { meta }),
  };
  return res.status(200).json(body);
}

export function sendCreated<T>(res: Response, data: T, message?: string, meta?: Meta) {
  const body: ApiSuccess<T> = {
    success: true,
    data,
    ...(message && { message }),
    ...(meta && { meta }),
  };
  return res.status(201).json(body);
}

export function sendNoContent(res: Response) {
  // Prefer true 204 with no body
  return res.status(204).end();
}

// Convenience for paginated lists
export function sendPaginated<T>(
  res: Response,
  items: T[],
  meta: { page: number; limit: number; total: number },
  message?: string,
) {
  return sendOk(res, items, message, meta);
}
