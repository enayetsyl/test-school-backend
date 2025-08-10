"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
// src/utils/logger.ts
exports.logger = {
    info: (...args) => console.log('[INFO]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
};
