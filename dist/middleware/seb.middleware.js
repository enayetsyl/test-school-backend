"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSebHeaders = requireSebHeaders;
const env_1 = require("../config/env");
const error_1 = require("../utils/error");
/** Minimal SEB guard: in `block` mode, required headers must be present; in `warn`, we allow through. */
function requireSebHeaders(req, _res, next) {
    const cfg = env_1.env.SEB_MODE; // 'block' | 'warn'
    const present = Boolean(req.headers['x-safe-exam-browser-configkeyhash'] ||
        req.headers['x-safe-exam-browser-requesthash']);
    req.sebHeadersPresent = present;
    if (cfg === 'block' && !present) {
        throw new error_1.AppError('FORBIDDEN', 'Safe Exam Browser required', 403);
    }
    return next();
}
