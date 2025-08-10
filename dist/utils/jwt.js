"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
// src/utils/jwt.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const accessSecret = env_1.env.JWT_ACCESS_SECRET;
const refreshSecret = env_1.env.JWT_REFRESH_SECRET;
const accessExpire = env_1.env.JWT_ACCESS_EXPIRES_IN;
const refreshExpire = env_1.env.JWT_REFRESH_EXPIRES_IN;
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, accessSecret, {
        expiresIn: accessExpire,
    });
}
function signRefreshToken(payload) {
    return jsonwebtoken_1.default.sign({ ...payload, typ: 'refresh' }, refreshSecret, { expiresIn: refreshExpire });
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
}
function verifyRefreshToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_REFRESH_SECRET);
    if (decoded.typ !== 'refresh') {
        throw new Error('Invalid token type');
    }
    return decoded;
}
