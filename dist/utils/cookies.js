"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshCookie = setRefreshCookie;
exports.clearRefreshCookie = clearRefreshCookie;
exports.readRefreshFromCookieOrHeader = readRefreshFromCookieOrHeader;
const env_1 = require("../config/env");
const REFRESH_COOKIE_NAME = 'refreshToken';
function setRefreshCookie(res, token) {
    if (env_1.env.AUTH_REFRESH_TRANSPORT !== 'cookie')
        return;
    // 7d default; but we don’t compute maxAge here from env string — use a safe hard cap or parse if you prefer.
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    res.cookie(REFRESH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: env_1.isProd,
        sameSite: 'lax',
        path: '/api/v1/auth/token',
        maxAge: sevenDaysMs,
    });
}
function clearRefreshCookie(res) {
    if (env_1.env.AUTH_REFRESH_TRANSPORT !== 'cookie')
        return;
    res.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        secure: env_1.isProd,
        sameSite: 'lax',
        path: '/api/v1/auth/token',
    });
}
function readRefreshFromCookieOrHeader(req) {
    if (env_1.env.AUTH_REFRESH_TRANSPORT === 'cookie') {
        return req.cookies?.refreshToken;
    }
    // header transport: Authorization: Bearer <refreshToken>
    const auth = req.get('authorization') ?? '';
    const [, token] = auth.split(' ');
    return token;
}
