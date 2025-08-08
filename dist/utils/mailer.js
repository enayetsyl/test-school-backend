import nodemailer from 'nodemailer';
import { env } from '../config/env';
let transporter = null;
export function getMailer() {
    if (transporter)
        return transporter;
    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        transporter = nodemailer.createTransport({ jsonTransport: true });
        return transporter;
    }
    const smtpOpts = {
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Boolean(SMTP_SECURE),
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    };
    transporter = nodemailer.createTransport(smtpOpts);
    return transporter;
}
