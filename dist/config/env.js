"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProd = exports.env = void 0;
// src/config/env.ts
const node_path_1 = __importDefault(require("node:path"));
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)(); // Load from .env
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(8080),
    MONGO_URI: zod_1.z.string().min(1),
    JWT_ACCESS_SECRET: zod_1.z.string().min(32),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.union([zod_1.z.string().min(1), zod_1.z.coerce.number()]),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.union([zod_1.z.string().min(1), zod_1.z.coerce.number()]),
    AUTH_REFRESH_TRANSPORT: zod_1.z.enum(['cookie', 'header']).default('cookie'),
    CLIENT_URL: zod_1.z.string().url().default('http://localhost:5173'),
    // Optional CSRF toggle (useful only if using cookies for state-changing routes)
    CSRF_ENABLED: zod_1.z
        .union([zod_1.z.literal('true'), zod_1.z.literal('false')])
        .default('false')
        .transform((v) => v === 'true'),
    SMTP_HOST: zod_1.z.string().min(1),
    SMTP_PORT: zod_1.z.string().min(1),
    SMTP_SECURE: zod_1.z.string().transform((v) => v === 'true'),
    SMTP_USER: zod_1.z.string().min(1),
    SMTP_PASS: zod_1.z.string().min(1),
    SMTP_FROM: zod_1.z.string().min(1),
    UPLOAD_DIR: zod_1.z.string().default('storage/uploads'),
    VIDEO_DIR: zod_1.z.string().default('storage/videos'),
    SEB_MODE: zod_1.z.enum(['block', 'warn']).default('warn'),
    TIME_PER_QUESTION_SECONDS: zod_1.z.coerce.number().default(60),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce.number().default(60000),
    RATE_LIMIT_MAX: zod_1.z.coerce.number().default(100),
    SEED_ADMIN_EMAIL: zod_1.z.email(),
    SEED_ADMIN_NAME: zod_1.z.string(),
    SEED_ADMIN_PASS: zod_1.z.string(),
});
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}
const raw = parsed.data;
// Normalize paths to ABSOLUTE (so Windows `\tmp\...` confusion goes away)
const resolveAbs = (p) => (node_path_1.default.isAbsolute(p) ? p : node_path_1.default.resolve(process.cwd(), p));
exports.env = {
    ...raw,
    UPLOAD_DIR: resolveAbs(raw.UPLOAD_DIR),
    VIDEO_DIR: resolveAbs(raw.VIDEO_DIR),
};
exports.isProd = exports.env.NODE_ENV === 'production';
