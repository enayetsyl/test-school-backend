import { AppError, toErrorResponse } from '../utils/error';
import { ZodError } from 'zod';
export function errorHandler(err, _req, res, _next) {
    void _next;
    if (err instanceof AppError) {
        return res.status(err.status).json(toErrorResponse(err));
    }
    // Zod errors (for validators) – keep it brief; expand if you like
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: err.issues,
        });
    }
    console.error(err);
    return res
        .status(500)
        .json({ success: false, code: 'SERVER_ERROR', message: 'Something went wrong' });
}
