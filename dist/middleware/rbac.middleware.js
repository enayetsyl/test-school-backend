"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
const error_1 = require("../utils/error");
function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user)
            throw new error_1.AppError('UNAUTHORIZED', 'Login required', 401);
        if (!roles.includes(req.user.role))
            throw new error_1.AppError('FORBIDDEN', 'Insufficient role', 403);
        next();
    };
}
