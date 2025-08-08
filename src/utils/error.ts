// src/utils/error.ts
export class AppError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(code: string, message: string, status = 400, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function toErrorResponse(err: unknown) {
  if (err instanceof AppError) {
    return { success: false, code: err.code, message: err.message, details: err.details };
  }
  return { success: false, code: 'SERVER_ERROR', message: 'Something went wrong' };
}
