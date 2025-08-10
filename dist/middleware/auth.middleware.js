"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const jwt_1 = require("../utils/jwt");
const error_1 = require("../utils/error");
function requireAuth(req, _res, next) {
    const header = req.get('authorization') ?? '';
    const [, token] = header.split(' ');
    if (!token)
        throw new error_1.AppError('UNAUTHORIZED', 'Missing bearer token', 401);
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch {
        throw new error_1.AppError('UNAUTHORIZED', 'Invalid or expired token', 401);
    }
}
function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user)
            throw new error_1.AppError('UNAUTHORIZED', 'Login required', 401);
        if (!roles.includes(req.user.role))
            throw new error_1.AppError('FORBIDDEN', 'Insufficient role', 403);
        next();
    };
}
