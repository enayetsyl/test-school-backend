import { config } from 'dotenv';
import { z } from 'zod';

config(); // Load from .env

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  PORT: z.coerce.number().default(8080),

  MONGO_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.union([z.string().min(1), z.coerce.number()]),
  JWT_REFRESH_EXPIRES_IN: z.union([z.string().min(1), z.coerce.number()]),

  AUTH_REFRESH_TRANSPORT: z.enum(['cookie', 'header']).default('cookie'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),

  // Optional CSRF toggle (useful only if using cookies for state-changing routes)
  CSRF_ENABLED: z
    .union([z.literal('true'), z.literal('false')])
    .default('false')
    .transform((v) => v === 'true'),

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().min(1),
  SMTP_SECURE: z.string().transform((v) => v === 'true'),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM: z.string().min(1),

  UPLOAD_DIR: z.string().default('/tmp/testschool/uploads'),
  VIDEO_DIR: z.string().default('/tmp/testschool/videos'),

  SEB_MODE: z.enum(['block', 'warn']).default('block'),
  TIME_PER_QUESTION_SECONDS: z.coerce.number().default(60),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
