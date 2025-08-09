import { env } from '../config/env';
import { AppError } from '../utils/error';
/** Minimal SEB guard: in `block` mode, required headers must be present; in `warn`, we allow through. */
export function requireSebHeaders(req, _res, next) {
    const cfg = env.SEB_MODE; // 'block' | 'warn'
    const present = Boolean(req.headers['x-safe-exam-browser-configkeyhash'] ||
        req.headers['x-safe-exam-browser-requesthash']);
    req.sebHeadersPresent = present;
    if (cfg === 'block' && !present) {
        throw new AppError('FORBIDDEN', 'Safe Exam Browser required', 403);
    }
    return next();
}
