// auth/validators/auth.validators.ts
import { z } from 'zod';
export const RegisterSchema = z.object({
    name: z.string().min(2).max(120),
    email: z.email(),
    password: z.string().min(8).max(100),
});
export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(100),
});
export const RefreshSchema = z.union([z.object({}), z.undefined()]).transform(() => ({}));
export const LogoutSchema = z.object({}); // nothing needed
export const SendOtpSchema = z.object({
    email: z.email(),
    purpose: z.enum(['verify', 'reset']),
});
export const VerifyOtpSchema = z.object({
    email: z.email(),
    otp: z.string().min(4).max(10),
    purpose: z.enum(['verify', 'reset']),
});
export const ResendOtpSchema = SendOtpSchema;
export const ForgotSchema = z.object({
    email: z.email(),
});
export const ResetSchema = z.object({
    email: z.email(),
    otp: z.string().min(4).max(10),
    newPassword: z.string().min(8).max(100),
});
