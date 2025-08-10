"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = sendOtpEmail;
exports.sendResetConfirmation = sendResetConfirmation;
// src/services/mailer.service.ts
const mailer_1 = require("../utils/mailer");
const env_1 = require("../config/env");
async function sendOtpEmail(to, otp, purpose) {
    const mailer = (0, mailer_1.getMailer)();
    const subject = purpose === 'verify' ? 'Your Test_School verification code' : 'Your Test_School reset code';
    await mailer.sendMail({
        from: env_1.env.SMTP_FROM,
        to,
        subject,
        text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
    });
}
async function sendResetConfirmation(to) {
    const mailer = (0, mailer_1.getMailer)();
    await mailer.sendMail({
        from: env_1.env.SMTP_FROM,
        to,
        subject: 'Your password has been reset',
        text: 'If you did not request this change, please contact support immediately.',
    });
}
