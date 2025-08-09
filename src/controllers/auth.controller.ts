// src/controllers/auth.controller.ts
import type { Request, Response } from 'express';
import type { UserDoc } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import {
  registerUser,
  loginUser,
  rotateRefreshToken,
  logoutUser,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from '../services/auth.service';
import {
  setRefreshCookie,
  clearRefreshCookie,
  readRefreshFromCookieOrHeader,
} from '../utils/cookies';
import { sendOk, sendCreated } from '../utils/respond';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);
  return sendCreated(
    res,
    { user: publicUser(user) },
    'Registered. Verification code sent to email.',
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await loginUser(req.body);
  setRefreshCookie(res, refreshToken);
  return sendOk(res, { user: publicUser(user), accessToken });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const rt = readRefreshFromCookieOrHeader(req);
  if (!rt)
    return res
      .status(401)
      .json({ success: false, code: 'UNAUTHORIZED', message: 'Missing refresh token' });

  const { accessToken, refreshToken } = await rotateRefreshToken(rt);
  setRefreshCookie(res, refreshToken);
  return sendOk(res, { accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const rt = readRefreshFromCookieOrHeader(req);
  await logoutUser(rt);
  clearRefreshCookie(res);
  return res.noContent();
});

export const sendOtpCtrl = asyncHandler(async (req: Request, res: Response) => {
  await sendOtp(req.body.email, req.body.purpose);
  return sendOk(res, { sent: true }, 'OTP sent');
});

export const verifyOtpCtrl = asyncHandler(async (req: Request, res: Response) => {
  const out = await verifyOtp(req.body.email, req.body.otp, req.body.purpose);
  return sendOk(res, out, 'OTP verified');
});

export const forgot = asyncHandler(async (req: Request, res: Response) => {
  await forgotPassword(req.body.email);
  return sendOk(res, { sent: true }, 'If the email exists, an OTP has been sent.');
});

export const reset = asyncHandler(async (req: Request, res: Response) => {
  await resetPassword(req.body.email, req.body.otp, req.body.newPassword);
  return sendOk(res, { reset: true }, 'Password reset successful. Please login.');
});

export function publicUser(u: UserDoc) {
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
