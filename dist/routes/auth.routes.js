// src/routes/auth.routes.ts
import { Router } from 'express';
import { validate } from '../middleware/validation.middleware';
import { RegisterSchema, LoginSchema, RefreshSchema, LogoutSchema, SendOtpSchema, VerifyOtpSchema, ForgotSchema, ResetSchema, } from '../validators/auth.validators';
import { register, login, refresh, logout, sendOtpCtrl, verifyOtpCtrl, forgot, reset, } from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rate-limit';
const router = Router();
router.post('/register', authLimiter, validate(RegisterSchema), register);
router.post('/login', authLimiter, validate(LoginSchema), login);
router.post('/token/refresh', authLimiter, validate(RefreshSchema), refresh);
router.post('/logout', validate(LogoutSchema), logout);
router.post('/otp/send', authLimiter, validate(SendOtpSchema), sendOtpCtrl);
router.post('/otp/verify', authLimiter, validate(VerifyOtpSchema), verifyOtpCtrl);
router.post('/otp/resend', authLimiter, validate(SendOtpSchema), sendOtpCtrl);
router.post('/forgot', authLimiter, validate(ForgotSchema), forgot);
router.post('/reset', authLimiter, validate(ResetSchema), reset);
export default router;
