import { config } from 'dotenv';
import { z } from 'zod';

config(); // Load from .env

const envSchema = z.object({
  PORT: z.string().default('8080'),
  CLIENT_URL: z.string().url(),
  MONGO_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().min(1),
  SMTP_SECURE: z.string().transform((v) => v === 'true'),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().min(1),
  UPLOAD_DIR: z.string().default('/tmp/testschool/uploads'),
  VIDEO_DIR: z.string().default('/tmp/testschool/videos'),
  AUTH_REFRESH_TRANSPORT: z.enum(['cookie', 'header']).default('cookie'),
  SEB_MODE: z.enum(['block', 'warn']).default('block'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

export const env = envSchema.parse(process.env);
