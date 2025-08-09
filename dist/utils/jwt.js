// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
const accessSecret = env.JWT_ACCESS_SECRET;
const refreshSecret = env.JWT_REFRESH_SECRET;
const accessExpire = env.JWT_ACCESS_EXPIRES_IN;
const refreshExpire = env.JWT_REFRESH_EXPIRES_IN;
export function signAccessToken(payload) {
    return jwt.sign(payload, accessSecret, {
        expiresIn: accessExpire,
    });
}
export function signRefreshToken(payload) {
    return jwt.sign({ ...payload, typ: 'refresh' }, refreshSecret, { expiresIn: refreshExpire });
}
export function verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
}
export function verifyRefreshToken(token) {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    if (decoded.typ !== 'refresh') {
        throw new Error('Invalid token type');
    }
    return decoded;
}
