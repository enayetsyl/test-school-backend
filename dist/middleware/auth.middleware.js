import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/error';
export function requireAuth(req, _res, next) {
    const header = req.get('authorization') ?? '';
    const [, token] = header.split(' ');
    if (!token)
        throw new AppError('UNAUTHORIZED', 'Missing bearer token', 401);
    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    }
    catch {
        throw new AppError('UNAUTHORIZED', 'Invalid or expired token', 401);
    }
}
export function requireRole(...roles) {
    return (req, _res, next) => {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Login required', 401);
        if (!roles.includes(req.user.role))
            throw new AppError('FORBIDDEN', 'Insufficient role', 403);
        next();
    };
}
