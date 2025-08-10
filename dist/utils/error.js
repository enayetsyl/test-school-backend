"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.toErrorResponse = toErrorResponse;
// src/utils/error.ts
class AppError extends Error {
    constructor(code, message, status = 400, details) {
        super(message);
        this.code = code;
        this.status = status;
        this.details = details;
    }
}
exports.AppError = AppError;
function toErrorResponse(err) {
    if (err instanceof AppError) {
        return { success: false, code: err.code, message: err.message, details: err.details };
    }
    return { success: false, code: 'SERVER_ERROR', message: 'Something went wrong' };
}
