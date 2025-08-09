// src/services/mailer.service.ts
import { getMailer } from '../utils/mailer';
import { env } from '../config/env';

export async function sendOtpEmail(to: string, otp: string, purpose: 'verify' | 'reset') {
  const mailer = getMailer();
  const subject =
    purpose === 'verify' ? 'Your Test_School verification code' : 'Your Test_School reset code';
  await mailer.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
  });
}

export async function sendResetConfirmation(to: string) {
  const mailer = getMailer();
  await mailer.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: 'Your password has been reset',
    text: 'If you did not request this change, please contact support immediately.',
  });
}
