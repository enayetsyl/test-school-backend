"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = exports.forgot = exports.verifyOtpCtrl = exports.sendOtpCtrl = exports.logout = exports.refresh = exports.login = exports.register = void 0;
exports.publicUser = publicUser;
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_service_1 = require("../services/auth.service");
const cookies_1 = require("../utils/cookies");
const respond_1 = require("../utils/respond");
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await (0, auth_service_1.registerUser)(req.body);
    return (0, respond_1.sendCreated)(res, { user: publicUser(user) }, 'Registered. Verification code sent to email.');
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { user, accessToken, refreshToken } = await (0, auth_service_1.loginUser)(req.body);
    (0, cookies_1.setRefreshCookie)(res, refreshToken);
    return (0, respond_1.sendOk)(res, { user: publicUser(user), accessToken });
});
exports.refresh = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const rt = (0, cookies_1.readRefreshFromCookieOrHeader)(req);
    if (!rt)
        return res
            .status(401)
            .json({ success: false, code: 'UNAUTHORIZED', message: 'Missing refresh token' });
    const { accessToken, refreshToken } = await (0, auth_service_1.rotateRefreshToken)(rt);
    (0, cookies_1.setRefreshCookie)(res, refreshToken);
    return (0, respond_1.sendOk)(res, { accessToken });
});
exports.logout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const rt = (0, cookies_1.readRefreshFromCookieOrHeader)(req);
    await (0, auth_service_1.logoutUser)(rt);
    (0, cookies_1.clearRefreshCookie)(res);
    return res.noContent();
});
exports.sendOtpCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, auth_service_1.sendOtp)(req.body.email, req.body.purpose);
    return (0, respond_1.sendOk)(res, { sent: true }, 'OTP sent');
});
exports.verifyOtpCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const out = await (0, auth_service_1.verifyOtp)(req.body.email, req.body.otp, req.body.purpose);
    return (0, respond_1.sendOk)(res, out, 'OTP verified');
});
exports.forgot = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await (0, auth_service_1.forgotPassword)(req.body.email);
    return (0, respond_1.sendOk)(res, { sent: true }, 'If the email exists, an OTP has been sent.');
});
exports.reset = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    console.log('req.body', req.body);
    const rest = await (0, auth_service_1.resetPassword)(req.body.email, req.body.otp, req.body.newPassword);
    console.log('reset password', rest);
    return (0, respond_1.sendOk)(res, { reset: true }, 'Password reset successful. Please login.');
});
function publicUser(u) {
    // keep tight: do not expose sensitive props
    return {
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: u.emailVerified,
        status: u.status,
        isLockedFromStep1: u.isLockedFromStep1 ?? false,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
    };
}
