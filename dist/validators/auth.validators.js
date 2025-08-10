"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetSchema = exports.ForgotSchema = exports.ResendOtpSchema = exports.VerifyOtpSchema = exports.SendOtpSchema = exports.LogoutSchema = exports.RefreshSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
// auth/validators/auth.validators.ts
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(120),
    email: zod_1.z.email(),
    password: zod_1.z.string().min(8).max(100),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(8).max(100),
});
exports.RefreshSchema = zod_1.z.union([zod_1.z.object({}), zod_1.z.undefined()]).transform(() => ({}));
exports.LogoutSchema = zod_1.z.object({}); // nothing needed
exports.SendOtpSchema = zod_1.z.object({
    email: zod_1.z.email(),
    purpose: zod_1.z.enum(['verify', 'reset']),
});
exports.VerifyOtpSchema = zod_1.z.object({
    email: zod_1.z.email(),
    otp: zod_1.z.string().min(4).max(10),
    purpose: zod_1.z.enum(['verify', 'reset']),
});
exports.ResendOtpSchema = exports.SendOtpSchema;
exports.ForgotSchema = zod_1.z.object({
    email: zod_1.z.email(),
});
exports.ResetSchema = zod_1.z.object({
    email: zod_1.z.email(),
    otp: zod_1.z.string().min(4).max(10),
    newPassword: zod_1.z.string().min(8).max(100),
});
