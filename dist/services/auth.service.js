"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.issueTokens = issueTokens;
exports.rotateRefreshToken = rotateRefreshToken;
exports.logoutUser = logoutUser;
exports.issueOtp = issueOtp;
exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
// src/services/auth.service.ts
const node_crypto_1 = __importDefault(require("node:crypto"));
const mongoose_1 = require("mongoose");
const User_1 = require("../models/User");
const OtpToken_1 = require("../models/OtpToken");
const RefreshToken_1 = require("../models/RefreshToken");
const hasher_1 = require("../utils/hasher");
const jwt_1 = require("../utils/jwt");
const mailer_service_1 = require("./mailer.service");
const error_1 = require("../utils/error");
const env_1 = require("../config/env");
function hashRefreshForDB(token) {
    // Use a fast, one-way hash for DB storage (not bcrypt – we just need lookup)
    return node_crypto_1.default.createHash('sha256').update(token).digest('hex');
}
async function registerUser(params) {
    const exists = await User_1.User.findOne({ email: params.email });
    if (exists)
        throw new error_1.AppError('CONFLICT', 'Email already registered', 409);
    const passwordHash = await (0, hasher_1.hashPassword)(params.password);
    const user = await User_1.User.create({
        name: params.name,
        email: params.email,
        passwordHash,
        role: 'student',
        emailVerified: false,
        status: 'active',
    });
    // send verification OTP (optional)
    const otp = await issueOtp(user._id.toString(), 'verify');
    await (0, mailer_service_1.sendOtpEmail)(user.email, otp, 'verify');
    return user;
}
async function loginUser(params) {
    const user = await User_1.User.findOne({ email: params.email });
    if (!user)
        throw new error_1.AppError('UNAUTHORIZED', 'Invalid credentials', 401);
    if (user.status !== 'active')
        throw new error_1.AppError('FORBIDDEN', 'Account disabled', 403);
    const ok = await (0, hasher_1.comparePassword)(params.password, user.passwordHash);
    if (!ok)
        throw new error_1.AppError('UNAUTHORIZED', 'Invalid credentials', 401);
    const tokens = await issueTokens(user._id.toString(), user.role);
    return { user, ...tokens };
}
async function issueTokens(userId, role) {
    const jti = node_crypto_1.default.randomUUID();
    const access = (0, jwt_1.signAccessToken)({ sub: userId, role, jti });
    const refreshJti = node_crypto_1.default.randomUUID();
    const refresh = (0, jwt_1.signRefreshToken)({ sub: userId, jti: refreshJti });
    const tokenHash = hashRefreshForDB(refresh);
    const expiresAt = new Date(Date.now() + parseExpiryMs(env_1.env.JWT_REFRESH_EXPIRES_IN));
    await RefreshToken_1.RefreshToken.create({
        userId: new mongoose_1.Types.ObjectId(userId),
        tokenHash,
        expiresAt,
    });
    return { accessToken: access, refreshToken: refresh };
}
async function rotateRefreshToken(rawToken) {
    const decoded = (0, jwt_1.verifyRefreshToken)(rawToken); // throws if invalid or wrong typ
    const tokenHash = hashRefreshForDB(rawToken);
    // Check not revoked/expired in DB
    const doc = await RefreshToken_1.RefreshToken.findOne({ userId: decoded.sub, tokenHash });
    if (!doc || doc.revokedAt || doc.expiresAt < new Date()) {
        throw new error_1.AppError('UNAUTHORIZED', 'Invalid refresh token', 401);
    }
    // Revoke old & issue new pair
    doc.revokedAt = new Date();
    await doc.save();
    const user = await User_1.User.findById(decoded.sub);
    if (!user)
        throw new error_1.AppError('UNAUTHORIZED', 'User not found', 401);
    return issueTokens(user._id.toString(), user.role);
}
async function logoutUser(rawToken) {
    if (!rawToken)
        return;
    const tokenHash = hashRefreshForDB(rawToken);
    await RefreshToken_1.RefreshToken.updateMany({ tokenHash, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } });
}
async function issueOtp(userId, purpose) {
    const otp = generateOtp(6);
    const otpHash = await (0, hasher_1.hashPassword)(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await OtpToken_1.OtpToken.create({
        userId: new mongoose_1.Types.ObjectId(userId),
        channel: 'email',
        otpHash,
        purpose,
        expiresAt,
    });
    return otp;
}
async function sendOtp(email, purpose) {
    const user = await User_1.User.findOne({ email });
    if (!user)
        throw new error_1.AppError('NOT_FOUND', 'User not found', 404);
    const otp = await issueOtp(user._id.toString(), purpose);
    await (0, mailer_service_1.sendOtpEmail)(user.email, otp, purpose);
    return { sent: true };
}
async function verifyOtp(email, otp, purpose) {
    const user = await User_1.User.findOne({ email });
    if (!user)
        throw new error_1.AppError('NOT_FOUND', 'User not found', 404);
    console.log('email otp purpose', email, otp, purpose);
    const record = await OtpToken_1.OtpToken.findOne({
        userId: user._id,
        purpose,
        consumedAt: { $exists: false },
        expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });
    console.log('record', record);
    if (!record)
        throw new error_1.AppError('UNAUTHORIZED', 'OTP expired or not found', 401);
    const ok = await (0, hasher_1.comparePassword)(otp, record.otpHash);
    if (!ok)
        throw new error_1.AppError('UNAUTHORIZED', 'Invalid OTP', 401);
    record.consumedAt = new Date();
    await record.save();
    if (purpose === 'verify') {
        user.emailVerified = true;
        await user.save();
    }
    return { verified: true };
}
async function forgotPassword(email) {
    const user = await User_1.User.findOne({ email });
    if (!user)
        return { sent: true }; // do not leak existence
    const otp = await issueOtp(user._id.toString(), 'reset');
    await (0, mailer_service_1.sendOtpEmail)(user.email, otp, 'reset');
    return { sent: true };
}
async function resetPassword(email, otp, newPassword) {
    const user = await User_1.User.findOne({ email });
    if (!user)
        throw new error_1.AppError('NOT_FOUND', 'User not found', 404);
    // verify OTP with purpose reset
    const res = await verifyOtp(email, otp, 'reset');
    if (!res.verified)
        throw new error_1.AppError('UNAUTHORIZED', 'Invalid OTP', 401);
    const passwordHash = await (0, hasher_1.hashPassword)(newPassword);
    user.passwordHash = passwordHash;
    await user.save();
    // revoke all refresh tokens
    await RefreshToken_1.RefreshToken.updateMany({ userId: user._id, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } });
    await (0, mailer_service_1.sendResetConfirmation)(user.email);
    return { reset: true };
}
function generateOtp(len) {
    const bytes = node_crypto_1.default.randomBytes(len);
    return Array.from(bytes, (b) => (b % 10).toString()).join('');
}
function parseExpiryMs(v) {
    if (typeof v === 'number')
        return v * 1000; // if number, assume seconds
    // allow "7d", "15m", "3600" etc — jsonwebtoken accepts these but our env is validated as string|number
    // here we just handle simple cases; fallback to seconds
    const m = /^(\d+)([smhd])?$/.exec(v);
    if (!m)
        return Number(v) * 1000;
    const n = Number(m[1]);
    const unit = (m[2] ?? 's');
    const map = {
        s: 1000,
        m: 60000,
        h: 3600000,
        d: 86400000,
    };
    return n * map[unit];
}
