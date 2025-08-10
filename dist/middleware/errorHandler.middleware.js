"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const error_1 = require("../utils/error");
const zod_1 = require("zod");
function errorHandler(err, _req, res, _next) {
    void _next;
    if (err instanceof error_1.AppError) {
        return res.status(err.status).json((0, error_1.toErrorResponse)(err));
    }
    // Zod errors (for validators) – keep it brief; expand if you like
    if (err instanceof zod_1.ZodError) {
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
