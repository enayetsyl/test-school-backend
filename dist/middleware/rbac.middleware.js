import { AppError } from '../utils/error';
export function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Login required', 401);
        if (!roles.includes(req.user.role))
            throw new AppError('FORBIDDEN', 'Insufficient role', 403);
        next();
    };
}
