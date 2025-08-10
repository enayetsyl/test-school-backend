"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMailer = getMailer;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
let transporter = null;
function getMailer() {
    if (transporter)
        return transporter;
    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = env_1.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        transporter = nodemailer_1.default.createTransport({ jsonTransport: true });
        return transporter;
    }
    const smtpOpts = {
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Boolean(SMTP_SECURE),
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    };
    transporter = nodemailer_1.default.createTransport(smtpOpts);
    return transporter;
}
