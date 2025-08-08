```javascript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}

```

```javascript
// package.json
{
  "name": "test-school-backend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "rimraf dist && tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "prepare": "husky"
  },
  "lint-staged": {
    "src/**/*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css,yml,yaml}": [
      "prettier --write"
    ]
  },
  "dependencies": {
    "@fast-csv/format": "^5.0.5",
    "@fast-csv/parse": "^5.0.5",
    "bcrypt": "^6.0.0",
    "bcryptjs": "^3.0.2",
    "compression": "^1.8.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^17.2.1",
    "express": "^5.1.0",
    "express-mongo-sanitize": "^2.2.0",
    "express-rate-limit": "^8.0.1",
    "fs-extra": "^11.3.1",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.17.1",
    "morgan": "^1.10.1",
    "multer": "^2.0.2",
    "node-cron": "^4.2.1",
    "nodemailer": "^7.0.5",
    "pdfkit": "^0.17.1",
    "socket.io": "^4.8.1",
    "zod": "^4.0.15"
  },
  "devDependencies": {
    "@commitlint/cli": "^19.8.1",
    "@commitlint/config-conventional": "^19.8.1",
    "@eslint/js": "^9.32.0",
    "@types/bcrypt": "^6.0.0",
    "@types/cookie-parser": "^1.4.9",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.3",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/morgan": "^1.9.10",
    "@types/node": "^24.2.0",
    "@types/nodemailer": "^6.4.17",
    "@typescript-eslint/eslint-plugin": "^8.39.0",
    "@typescript-eslint/parser": "^8.39.0",
    "eslint": "^9.32.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-import": "^2.32.0",
    "globals": "^16.3.0",
    "husky": "^9.1.7",
    "lint-staged": "^16.1.4",
    "prettier": "^3.6.2",
    "rimraf": "^6.0.1",
    "tsx": "^4.20.3",
    "typescript": "^5.9.2",
    "typescript-eslint": "^8.39.0"
  }
}


```

```javascript
// eslint.config.js
// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, {
  languageOptions: {
    sourceType: 'module',
    globals: {
      ...globals.node, // <-- use imported globals, not require()
    },
  },
  plugins: {
    import: importPlugin,
  },
  ignores: ['dist/**', 'node_modules/**'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

    'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],
  },
});
```

```javascript
// commitlint.config.cjs
/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'build',
        'ci',
        'revert',
      ],
    ],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'scope-case': [2, 'always', 'kebab-case'],
    // loosen header length if you want
    'header-max-length': [1, 'always', 100],
  },
};
```

```javascript
// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": true
}

```

```text
// .gitmessage.tsx
# Conventional Commits Guide
# Format: type(scope?): subject
# Types: feat | fix | docs | style | refactor | perf | test | chore | build | ci | revert
# Examples:
#   feat(api): add user login endpoint
#   fix(auth): handle token refresh bug
#   docs(readme): update installation steps
#   chore(deps): bump eslint to v9
#
# Body (optional, wrap at 72 chars):
# - Explain what and why (not how)
#
# Footer (optional):
# - BREAKING CHANGE: ...
# - Closes #123

```

```javascript
// .env
# Application
NODE_ENV=development
PORT=
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=

# JWT Secrets
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=

AUTH_REFRESH_TRANSPORT=cookie

# Email (Nodemailer)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# Paths (Render free tier uses /tmp for uploads)
UPLOAD_DIR=/tmp/testschool/uploads
VIDEO_DIR=/tmp/testschool/videos

# Feature flags

RATE_LIMIT_WINDOW_MS=
RATE_LIMIT_MAX=
CSRF_ENABLED=



SEB_MODE=
TIME_PER_QUESTION_SECONDS=
```

```javascript
// src/server.ts
import http from 'http';

import { Server as SocketIOServer } from 'socket.io';

import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});

connectDB();

// Socket events setup can go here or in src/config/socket.ts
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
});

server.listen(env.PORT, () => {
  console.log(`Server running on env. ${env.PORT}`);
});
```

```javascript
//src/app.ts
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
dotenv.config();

// import { errorHandler } from './middleware/error.middleware';
import routes from './routes';
import { respondMiddleware } from './middleware/respond.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(respondMiddleware);

// Routes
app.use('/api/v1', routes);

// Error handler
app.use(errorHandler);

export default app;
```

```javascript
// src/config.db.ts
import mongoose from 'mongoose';

import { env } from './env';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
```

```javascript
//  src/config/env.ts
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
```

```javascript
// src/config/socket.ts
```

```javascript
// src/controllers/auth.controller.ts
```

```javascript
// src/controllers/certification.controller.ts
```

```javascript
// // src/controllers/competency.controller.ts
```

```javascript
// src/controllers/config.controller.ts
```

```javascript
// src/controllers/exam.controller.ts
```

```javascript
// src/controllers/question.controller.ts
```

```javascript
// src/controllers/user.controller.ts
```

```javascript
// src/controllers/video.controller.ts
```

```javascript
// src/jobs/autoSubmitExpiredExams.job.ts
```

```javascript
// src/jobs/cleanupOldVideos.job.ts
```

```javascript
// src/jobs/cleanupTempUploads.job.ts
```

```javascript
// src/middleware/auth.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, type AccessTokenPayload } from '../utils/jwt';
import { AppError } from '../utils/error';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AccessTokenPayload;
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.get('authorization') ?? '';
  const [, token] = header.split(' ');
  if (!token) throw new AppError('UNAUTHORIZED', 'Missing bearer token', 401);

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    throw new AppError('UNAUTHORIZED', 'Invalid or expired token', 401);
  }
}

export function requireRole(...roles: AccessTokenPayload['role'][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError('UNAUTHORIZED', 'Login required', 401);
    if (!roles.includes(req.user.role)) throw new AppError('FORBIDDEN', 'Insufficient role', 403);
    next();
  };
}

```

```javascript
// src/middleware/errorHandler.middleware.ts
import type { NextFunction, Request, Response } from 'express';
import { AppError, toErrorResponse } from '../utils/error';
import { ZodError } from 'zod';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {

   void _next;

  if (err instanceof AppError) {
    return res.status(err.status).json(toErrorResponse(err));
  }

  // Zod errors (for validators) – keep it brief; expand if you like
  if ((err instanceof ZodError)) {
    return res.status(400).json({ success: false, code: 'VALIDATION_ERROR',  message: 'Invalid input',
      details: err.issues, });
  }

  console.error(err);
  return res.status(500).json({ success: false, code: 'SERVER_ERROR', message: 'Something went wrong' });
}

```

```javascript
// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, code: 'RATE_LIMITED', message: 'Too many requests, slow down.' },
});
```

```javascript
// src/middleware/rbac.middleware.ts
```

```javascript
// src/middleware/respond.middleware.ts
import type { NextFunction, Response, Request } from 'express';
import type { Meta } from '../types/api';

declare module 'express-serve-static-core' {
  interface Response {
    ok: <T>(data: T, message?: string, meta?: Meta) => Response;
    created: <T>(data: T, message?: string, meta?: Meta) => Response;
    noContent: () => Response;
    paginated: <T>(items: T[], meta: { page: number; limit: number; total: number }, message?: string) => Response;
  }
}

export function respondMiddleware(_req: Request, res: Response, next: NextFunction) {
  res.ok = function <T>(data: T, message?: string, meta?: Meta) {
    return this.status(200).json({ success: true, data, ...(message && { message }), ...(meta && { meta }) });
  };
  res.created = function <T>(data: T, message?: string, meta?: Meta) {
    return this.status(201).json({ success: true, data, ...(message && { message }), ...(meta && { meta }) });
  };
  res.noContent = function () {
    return this.status(204).end();
  };
  res.paginated = function <T>(
    items: T[],
    meta: { page: number; limit: number; total: number },
    message?: string,
  ) {
    return this.status(200).json({ success: true, data: items, ...(message && { message }), meta });
  };
  next();
}

```

```javascript
// src/middleware/seb.middleware.ts
```

```javascript
// src/middleware/validation.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import type { ZodError, ZodTypeAny } from 'zod';

type SchemaParts = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

// Narrower and eslint-safe check (no `any`)
function isZodSchema(s: unknown): s is ZodTypeAny {
  return !!s && typeof (s as ZodTypeAny).safeParse === 'function';
}

/**
 * Creates an Express middleware for validating request parts
 * using a Zod schema. Returns formatted error responses on failure.
 *
 * @param schema Zod schema or object with keys { body, query, params }
 */
export const validate =
  (schema: ZodTypeAny | SchemaParts) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isZodSchema(schema)) {
        // Single schema → validate body
        const result = schema.safeParse(req.body);
        if (!result.success) {
          return sendZodError(res, result.error);
        }
        req.body = result.data;
      } else {
        // Multiple parts: body/query/params
        if (schema.body) {
          const parsed = schema.body.safeParse(req.body);
          if (!parsed.success) {
            return sendZodError(res, parsed.error);
          }
          req.body = parsed.data;
        }
        if (schema.query) {
          const parsed = schema.query.safeParse(req.query);
          if (!parsed.success) {
            return sendZodError(res, parsed.error);
          }
          req.query =  parsed.data as unknown as Request['query'];
        }
        if (schema.params) {
          const parsed = schema.params.safeParse(req.params);
          if (!parsed.success) {
            return sendZodError(res, parsed.error);
          }
          req.params = parsed.data as unknown as Request['params'];
        }
      }
      return next();
    } catch  {
      return res.status(500).json({
        success: false,
        code: 'SERVER_ERROR',
        message: 'Validation middleware error',
      });
    }
  };

/**
 * Maps ZodError to the API error format defined in project rules.
 */
function sendZodError(res: Response, error: ZodError) {
  const firstIssue = error.issues[0];
  return res.status(400).json({
    success: false,
    code: 'VALIDATION_ERROR',
    message: firstIssue?.message ?? 'Invalid request',
    details: {
      field: firstIssue?.path?.join('.') ?? undefined,
      issues: error.issues.map((i) => ({
        path: i.path,
        message: i.message,
      })),
    },
  });
}

```

```javascript
// src/models/AuditLog.ts
```

```javascript
// src/models/Certification.ts
```

```javascript
// src/models/Competency.ts
```

```javascript
// src/models/ExamSession.ts
```

```javascript
// src/models/OtpToken.ts
```

```javascript
// src/models/Question.ts
```

```javascript
// src/models/RecordingAsset.ts
```

```javascript
// src/models/RefreshToken.ts
```

```javascript
// src/models/SystemConfig.ts
```

```javascript
// src/models/User.ts
```

```javascript
// src/routes/auth.routes.ts
```

```javascript
// src/routes/certification.routes.ts
```

```javascript
// src/routes/competency.routes.ts
```

```javascript
// src/routes/config.routes.ts
```

```javascript
// src/routes/exam.routes.ts
```

```javascript
// src/routes/index.ts
```

```javascript
// src/routes/question.routes.ts
```

```javascript
// src/routes/user.routes.ts
```

```javascript
// src/seed/seedAdmin.ts
```

```javascript
// src/seed/seedCompetencies.ts
```

```javascript
// src/seed/seedQuestions.ts
```

```javascript
// src/services/auth.service.ts
```

```javascript
// src/services/certification.service.ts
```

```javascript
// src/services/competency.service.ts
```

```javascript
// src/services/exam.service.ts
```

```javascript
// src/services/mailer.service.ts
```

```javascript
// src/services/question.service.ts
```

```javascript
// src/services/scoring.service.ts
```

```javascript
// src/services/user.service.ts
```

```javascript
// src/services/video.service.ts
```

```javascript
// src/sockets/exam.socket.ts
```

```javascript
// src/types/api.ts
export type Meta = Record<string, unknown> | undefined;

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: Meta;
}

```

```javascript
// src/utils/asyncHandler.ts
import type { Request, Response, NextFunction, RequestHandler } from 'express';

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

```

```javascript
// src/utils/cookies.ts
import type { Request, Response } from 'express';
import { env, isProd } from '../config/env';


const REFRESH_COOKIE_NAME = 'rt';

export function setRefreshCookie(res: Response, token: string) {
  if (env.AUTH_REFRESH_TRANSPORT !== 'cookie') return;

  // 7d default; but we don’t compute maxAge here from env string — use a safe hard cap or parse if you prefer.
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/v1/auth/token', // narrowest path that still works for refresh route
    maxAge: sevenDaysMs,
  });
}

export function clearRefreshCookie(res: Response) {
  if (env.AUTH_REFRESH_TRANSPORT !== 'cookie') return;
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/api/v1/auth/token',
  });
}

export function readRefreshFromCookieOrHeader(req: Request): string | undefined {
  if (env.AUTH_REFRESH_TRANSPORT === 'cookie') {
    return req.cookies?.rt;
  }
  // header transport: Authorization: Bearer <refreshToken>
  const auth = req.get('authorization') ?? '';
  const [, token] = auth.split(' ');
  return token;
}

```

```javascript
// src/utils/csv.ts
```

```javascript
// src/utils/error.ts
export class AppError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(code: string, message: string, status = 400, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function toErrorResponse(err: unknown) {
  if (err instanceof AppError) {
    return { success: false, code: err.code, message: err.message, details: err.details };
  }
  return { success: false, code: 'SERVER_ERROR', message: 'Something went wrong' };
}

```

```javascript
// src/utils/file.ts
```

```javascript
// src/utils/hasher.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as Bcrypt from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as BcryptJs from 'bcryptjs';

type BcryptLib = {
  hash(data: string, saltOrRounds: string | number): Promise<string>;
  compare(data: string, encrypted: string): Promise<boolean>;
};

let primary: BcryptLib | undefined;
let fallback: BcryptLib | undefined;

try {
  primary = (await import('bcrypt')) as unknown as BcryptLib;
} catch {
  // ignore load error
}
try {
  fallback = (await import('bcryptjs')) as unknown as BcryptLib;
} catch {
  // ignore load error
}

const libCandidate = primary ?? fallback;
if (!libCandidate) {
  throw new Error('No bcrypt/bcryptjs available. Please install at least one.');
}
const lib: BcryptLib = libCandidate; // ✅ Now TS knows it's defined

const DEFAULT_ROUNDS = 10 as const;

export async function hashPassword(
  plain: string,
  rounds: number = DEFAULT_ROUNDS,
): Promise<string> {
  return lib.hash(plain, rounds);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return lib.compare(plain, hash);
}

```

```javascript
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';

import { env } from '../config/env';


type JwtId = string; // you can switch to UUID if you want jti tracking later

export interface AccessTokenPayload {
  sub: string;            // userId
  role: 'admin' | 'student' | 'supervisor';
  jti?: JwtId;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: JwtId;            // always present for rotation/revocation lists
  typ: 'refresh';
}

const accessSecret: Secret = env.JWT_ACCESS_SECRET as string;
const refreshSecret: Secret = env.JWT_REFRESH_SECRET as string;
const accessExpire: NonNullable<SignOptions['expiresIn']> = env.JWT_ACCESS_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>;
const refreshExpire: NonNullable<SignOptions['expiresIn']> = env.JWT_REFRESH_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>;


export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, accessSecret, {
    expiresIn: accessExpire,
  });
}

export function signRefreshToken(payload: Omit<RefreshTokenPayload, 'typ'>): string {
  return jwt.sign({ ...payload, typ: 'refresh' }, refreshSecret, { expiresIn: refreshExpire });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  if (decoded.typ !== 'refresh') {
    throw new Error('Invalid token type');
  }
  return decoded;
}

```

```javascript
// src/utils/logger.ts
export const logger = {
  info: (...args: unknown[]) => console.log('[INFO]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
};

```

```javascript
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { env } from '../config/env';

let transporter: nodemailer.Transporter | null = null;

export function getMailer(): nodemailer.Transporter {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    transporter = nodemailer.createTransport({ jsonTransport: true });
    return transporter;
  }

  const smtpOpts: SMTPTransport.Options = {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Boolean(SMTP_SECURE),
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  };

  transporter = nodemailer.createTransport(smtpOpts);
  return transporter;
}

```

```javascript
// src/utils/otp.ts
import crypto from 'node:crypto';
import { hashPassword, comparePassword } from './hasher';

export function generateNumericOtp(length = 6): string {
  // cryptographically strong digits (0-9)
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, b => (b % 10).toString()).join('');
}

export async function hashOtp(otp: string): Promise<string> {
  return hashPassword(otp, 10); // faster rounds for OTP (short-lived)
}

export async function verifyOtp(otp: string, otpHash: string): Promise<boolean> {
  return comparePassword(otp, otpHash);
}

```

```javascript
import type { Request } from 'express';
import type { Model, FilterQuery } from 'mongoose';

export interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

export async function paginate<T>(
  model: Model<T>,
  req: Request,
  filter: FilterQuery<T> = {},
  options: PaginationOptions = {},
) {
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.min(
    parseInt(req.query.limit as string) || options.defaultLimit || 10,
    options.maxLimit || 100,
  );
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    model.find(filter).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);

  return { items, meta: { page, limit, total } };
}

```

```javascript
// src/utils/pdf.ts
```

```javascript
// src/utils/respond.ts
import type { Response } from 'express';
import type { ApiSuccess, Meta } from '../types/api';

export function sendOk<T>(res: Response, data: T, message?: string, meta?: Meta) {
  const body: ApiSuccess<T> = { success: true, data, ...(message && { message }), ...(meta && { meta }) };
  return res.status(200).json(body);
}

export function sendCreated<T>(res: Response, data: T, message?: string, meta?: Meta) {
  const body: ApiSuccess<T> = { success: true, data, ...(message && { message }), ...(meta && { meta }) };
  return res.status(201).json(body);
}

export function sendNoContent(res: Response) {
  // Prefer true 204 with no body
  return res.status(204).end();
}

// Convenience for paginated lists
export function sendPaginated<T>(
  res: Response,
  items: T[],
  meta: { page: number; limit: number; total: number },
  message?: string,
) {
  return sendOk(res, items, message, meta);
}

```

```javascript
// auth/validators/auth.validators.ts
```

```javascript
// auth/validators/competency.validators.ts
```

```javascript
// auth/validators/config.validators.ts
```

```javascript
// auth/validators/exam.validators.ts
```

```javascript
// auth/validators/question.validator.ts
```

```javascript
// auth/validators/user.validator.ts
```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```

```javascript

```
