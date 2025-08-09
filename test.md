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

SEB_MODE=block
TIME_PER_QUESTION_SECONDS=60

SEED_ADMIN_EMAIL=enayetflweb@gmail.com
SEED_ADMIN_NAME=enayet
SEED_ADMIN_PASS=Ab123456@
```

```javascript
// src/server.ts
import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { scheduleAutoSubmitExpiredExamsJob } from './jobs/autoSubmitExpiredExams.job';
import { scheduleCleanupOldVideosJob } from './jobs/cleanupOldVideos.job';
import { initSocket } from './config/socket';

const server = http.createServer(app);
initSocket(server);

connectDB();
scheduleAutoSubmitExpiredExamsJob();
scheduleCleanupOldVideosJob(2);

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
// src/config/env.ts
import path from 'node:path';
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

   UPLOAD_DIR: z.string().default('storage/uploads'),
  VIDEO_DIR: z.string().default('storage/videos'),

  SEB_MODE: z.enum(['block', 'warn']).default('block'),
  TIME_PER_QUESTION_SECONDS: z.coerce.number().default(60),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  SEED_ADMIN_EMAIL: z.email(),
  SEED_ADMIN_NAME: z.string(),
  SEED_ADMIN_PASS: z.string(),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const raw = parsed.data;

// Normalize paths to ABSOLUTE (so Windows `\tmp\...` confusion goes away)
const resolveAbs = (p: string) => (path.isAbsolute(p) ? p : path.resolve(process.cwd(), p));

export const env = {
  ...raw,
  UPLOAD_DIR: resolveAbs(raw.UPLOAD_DIR),
  VIDEO_DIR: resolveAbs(raw.VIDEO_DIR),
} as const;
export const isProd = env.NODE_ENV === 'production';

```

```javascript
// src/config/socket.ts
import type http from 'node:http';
import { Server as SocketIOServer, type Socket } from 'socket.io';
import { env } from './env';
import { verifyAccessToken, type AccessTokenPayload } from '../utils/jwt';
import { registerExamSocketHandlers } from '../sockets/exam.socket';

let io: SocketIOServer | undefined;

export function initSocket(server: http.Server) {
  io = new SocketIOServer(server, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  // Lightweight auth middleware
  io.use((socket: Socket, next) => {
    try {
      const header = socket.handshake.headers.authorization ?? '';
      const bearer = (Array.isArray(header) ? header[0] : header) || '';
      const token = (socket.handshake.auth?.token as string) ||
                    (socket.handshake.query?.token as string) ||
                    bearer.split(' ')[1];

      if (!token) return next(new Error('Missing token'));
      const payload = verifyAccessToken(token);
      (socket.data as { user: AccessTokenPayload }).user = payload;
      return next();
    } catch {
      return next(new Error('Unauthorized'));
    }
  });

  registerExamSocketHandlers(io);
  return io;
}

export function getIO(): SocketIOServer {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

```

```javascript
// src/controllers/admin.sessions.controller.ts
import type { RequestHandler } from 'express';
import mongoose from 'mongoose';
// If you have a concrete model file, import it directly:
import { model } from 'mongoose';
const ExamSession = model('ExamSession');

import type {
  ListSessionsQueryType,
  SessionIdParamsType,
} from '../validators/admin.sessions.validators';


// controllers/admin.sessions.controller.ts (top, near imports)
type Role = 'admin' | 'student' | 'supervisor';

interface UserLite {
  _id: string;
  name?: string;
  email?: string;
  role: Role;
}

type SessionStatus = 'pending' | 'active' | 'submitted' | 'cancelled';

interface SessionListItem {
  _id: string;
  user: UserLite | null;              // populated minimal user
  step: 1 | 2 | 3;
  status: SessionStatus;
  score?: number;
  startedAt?: Date;
  submittedAt?: Date;
  violationsCount?: number;
  videoRecordingMeta?: {
    dir: string;
    mime?: string;
    chunks?: number;
    assembledPath?: string;
    sizeBytes?: number;
    completedAt?: Date;
  };
}

type DateRange = { $gte?: Date; $lte?: Date };
type SessionFilter = {
  status?: SessionStatus;
  step?: 1 | 2 | 3;
  user?: mongoose.Types.ObjectId;
  startedAt?: DateRange;
};

type Step = 1 | 2 | 3;
const isStep = (v: number): v is Step => v === 1 || v === 2 || v === 3;


export const listSessionsCtrl: RequestHandler = async (req, res) => {
  const { page, limit, q, status, step, userId, from, to } =
    req.query as unknown as ListSessionsQueryType;

  const filter: SessionFilter = {};
  if (status) filter.status = status;
  if (step !== undefined && isStep(step)) {
  filter.step = step; // now typed as 1 | 2 | 3 ✅
}
  if (userId) filter.user = new mongoose.Types.ObjectId(userId);
  if (from || to) {
    const range: DateRange = {};
    if (from) range.$gte = from;
    if (to) range.$lte = to;
    filter.startedAt = range;
  }

  const pageNum = page ?? 1;
  const lim = limit ?? 20;
  const skip = (pageNum - 1) * lim;

  const query = ExamSession.find(filter)
    .sort({ startedAt: -1 })
    .skip(skip)
    .limit(lim)
    .select('_id user step status score startedAt submittedAt violationsCount videoRecordingMeta')
    .populate({ path: 'user', select: 'name email role' });

  const [items, total] = await Promise.all([
    query.lean<SessionListItem[]>(),
    ExamSession.countDocuments(filter),
  ]);

  const text = q?.toLowerCase();
  const data = text
    ? items.filter((it) => {
        const name = it.user?.name?.toLowerCase() ?? '';
        const email = it.user?.email?.toLowerCase() ?? '';
        return name.includes(text) || email.includes(text);
      })
    : items;

  return res.json({
    success: true,
    meta: {
      page: pageNum,
      limit: lim,
      total,
      pageCount: Math.max(1, Math.ceil(total / lim)),
    },
    data,
  });
};

export const getSessionCtrl: RequestHandler = async (req, res) => {
  const { id } = req.params as unknown as SessionIdParamsType;

  const doc = await ExamSession.findById(id)
    .populate({ path: 'user', select: 'name email role' })
    .populate({ path: 'createdBy', select: 'name email role' })
    .lean();

  if (!doc) return res.status(404).json({ success: false, message: 'Session not found' });
  return res.json({ success: true, data: doc });
};


```

```javascript
// src/controllers/auth.controller.ts
import type { Request, Response } from 'express';
import type { UserDoc } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import {
  registerUser,
  loginUser,
  rotateRefreshToken,
  logoutUser,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from '../services/auth.service';
import { setRefreshCookie, clearRefreshCookie, readRefreshFromCookieOrHeader } from '../utils/cookies';
import { sendOk, sendCreated } from '../utils/respond';


export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);
  return sendCreated(res, { user: publicUser(user) }, 'Registered. Verification code sent to email.');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await loginUser(req.body);
  setRefreshCookie(res, refreshToken);
  return sendOk(res, { user: publicUser(user), accessToken });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const rt = readRefreshFromCookieOrHeader(req);
  if (!rt) return res.status(401).json({ success: false, code: 'UNAUTHORIZED', message: 'Missing refresh token' });

  const { accessToken, refreshToken } = await rotateRefreshToken(rt);
  setRefreshCookie(res, refreshToken);
  return sendOk(res, { accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const rt = readRefreshFromCookieOrHeader(req);
  await logoutUser(rt);
  clearRefreshCookie(res);
  return res.noContent();
});

export const sendOtpCtrl = asyncHandler(async (req: Request, res: Response) => {
  await sendOtp(req.body.email, req.body.purpose);
  return sendOk(res, { sent: true }, 'OTP sent');
});

export const verifyOtpCtrl = asyncHandler(async (req: Request, res: Response) => {
  const out = await verifyOtp(req.body.email, req.body.otp, req.body.purpose);
  return sendOk(res, out, 'OTP verified');
});

export const forgot = asyncHandler(async (req: Request, res: Response) => {
  await forgotPassword(req.body.email);
  return sendOk(res, { sent: true }, 'If the email exists, an OTP has been sent.');
});

export const reset = asyncHandler(async (req: Request, res: Response) => {
  await resetPassword(req.body.email, req.body.otp, req.body.newPassword);
  return sendOk(res, { reset: true }, 'Password reset successful. Please login.');
});

export function publicUser(u: UserDoc) {
  // keep tight: do not expose sensitive props
  return {
     id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    emailVerified: u.emailVerified,
    status: u.status,
    isLockedFromStep1: u.isLockedFromStep1 ?? false,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

```

```javascript
// src/controllers/certification.controller.ts
import type { RequestHandler } from 'express';
import path from 'node:path';
import fs from 'fs-extra';
import { asyncHandler } from '../utils/asyncHandler';
import { getMyCertification, getCertificationById, verifyByPublicId, ensurePdfForCertificate } from '../services/certification.service';
import { AppError } from '../utils/error';

export const meCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const cert = await getMyCertification(req.user!.sub);
  return cert ? res.ok({ certification: cert }) : res.ok({ certification: null });
});

export const getByIdCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const cert = await getCertificationById(req.params.id as string);
  if (!cert) throw new AppError('NOT_FOUND', 'Certificate not found', 404);
  return res.ok({ certification: cert });
});

export const verifyCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const out = await verifyByPublicId(req.params.certificateId as string);
  return res.ok(out, 'Verified');
});

export const pdfCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const cert = await getCertificationById(req.params.id as string);
  if (!cert) throw new AppError('NOT_FOUND', 'Certificate not found', 404);

  // Owner or admin can download
  const isOwner = String(cert.userId) === req.user!.sub;
  const isAdmin = req.user!.role === 'admin';
  if (!isOwner && !isAdmin) throw new AppError('FORBIDDEN', 'Not allowed', 403);

  const ensured = await ensurePdfForCertificate(String(cert._id));
  const file = ensured.pdfUrl!;
  const exists = await fs.pathExists(file);
  if (!exists) throw new AppError('SERVER_ERROR', 'PDF missing', 500);

  return res.download(file, path.basename(file));
});

```

```javascript
 // src/controllers/competency.controller.ts
import type { Request, RequestHandler, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { logAudit } from '../services/audit.service';
import {
  listCompetencies,
  createCompetency,
  getCompetency,
  updateCompetency,
  deleteCompetency,
} from '../services/competency.service';

type IdParams = { id: string };

export const listCtrl = asyncHandler(async (req: Request, res: Response) => {
  console.log('controller', req.query)
   const opts = {
    ...(req.query.page ? { page: Number(req.query.page) } : {}),
    ...(req.query.limit ? { limit: Number(req.query.limit) } : {}),
    ...(req.query.q ? { q: String(req.query.q) } : {}),
    ...(req.query.sortBy ? { sortBy: req.query.sortBy as 'name' | 'code' | 'createdAt' } : {}),
    ...(req.query.sortOrder ? { sortOrder: req.query.sortOrder as 'asc' | 'desc' } : {}),
  };

  const { items, meta } = await listCompetencies(opts);
  return res.paginated(items, meta);
});

export const createCtrl = asyncHandler(async (req, res) => {
  const doc = await createCompetency(req.body);
  await logAudit(req.user!.sub, 'COMPETENCY_CREATE', { type: 'Competency', id: doc._id.toString() });
  return res.created({ competency: doc }, 'Competency created');
});

export const getCtrl: RequestHandler<IdParams> = asyncHandler(async (req, res) => {
  const { id } = req.params as IdParams;      // validated by your params schema
  const c = await getCompetency(id);
  return res.ok({ competency: c });
});

export const updateCtrl: RequestHandler<IdParams> = asyncHandler(async (req, res) => {
  const { id } = req.params as IdParams;
  const c = await updateCompetency(id, req.body);
  await logAudit(req.user!.sub, 'COMPETENCY_UPDATE', { type: 'Competency', id: c._id.toString() }, { patch: req.body });
  return res.ok({ competency: c }, 'Updated');
});

export const deleteCtrl: RequestHandler<IdParams> = asyncHandler(async (req, res) => {
  const { id } = req.params as IdParams;
  console.log('comp id', id)
  const deleted = await deleteCompetency(id);
  await logAudit(req.user!.sub, 'COMPETENCY_DELETE', { type: 'Competency', id });
  return res.ok({ competency: deleted }, 'Competency deleted');
});
```

```javascript
// src/controllers/exam.controller.ts
import type { RequestHandler } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendOk, sendCreated } from '../utils/respond';
import {
  startExam,
  answerQuestion,
  submitExam,
  getSessionStatus,
  recordViolation,
} from '../services/exam.service';
import { type ViolationType } from '../models/ExamSession';
import { emitSessionStart, emitSessionAnswer, emitSessionViolation, emitSessionSubmit } from '../sockets/exam.socket';

export const startCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user!.sub;
  const step = Number(req.query.step) as 1 | 2 | 3;
  const client: {
    ip?: string;
    userAgent?: string;
    screen?: { width: number; height: number };
    sebHeadersPresent?: boolean;
  } = {
    ...(req.ip ? { ip: req.ip } : {}),
    ...(req.get('user-agent') ? { userAgent: req.get('user-agent')! } : {}),
    ...(req.body?.screen ? { screen: req.body.screen } : {}),
    ...(req.headers['x-safe-exam-browser-configkeyhash'] ||
    req.headers['x-safe-exam-browser-requesthash']
      ? { sebHeadersPresent: true }
      : {}),
  };
  const out = await startExam({ userId, step, client });

  emitSessionStart(out.sessionId, {
  userId,
  step,
  deadlineAt: out.deadlineAt.toISOString?.() ?? String(out.deadlineAt),
  totalQuestions: out.totalQuestions,
});

  return sendCreated(res, out, 'Exam started');
});

export const answerCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user!.sub;
  const { sessionId, questionId, selectedIndex, elapsedMs } = req.body as {
    sessionId: string;
    questionId: string;
    selectedIndex: number;
    elapsedMs?: number;
  };

  const payload: {
    userId: string;
    sessionId: string;
    questionId: string;
    selectedIndex: number;
    elapsedMs?: number;
  } = {
    userId,
    sessionId,
    questionId,
    selectedIndex,
    ...(elapsedMs !== undefined ? { elapsedMs } : {}),
  };

  const out = await answerQuestion(payload);

  const answeredAt = new Date().toISOString();

  emitSessionAnswer(req.body.sessionId, {
  questionId: req.body.questionId,
  selectedIndex: req.body.selectedIndex,
  answeredAt,
});

  return sendOk(res, out, 'Answer saved');
});

export const submitCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user!.sub;
  const { sessionId } = req.body as { sessionId: string };
  const out = await submitExam({ userId, sessionId, reason: 'user' });

emitSessionSubmit(req.body.sessionId, {
  status: out.status,
  scorePct: out.scorePct,
  ...(out.awardedLevel ? { awardedLevel: out.awardedLevel } : {}),
  proceedNext: out.proceedNext,
});

  return sendOk(res, out, 'Exam submitted');
});

export const statusCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user!.sub;
  const { sessionId } = req.params as { sessionId: string };
  const out = await getSessionStatus({ userId, sessionId });
  return sendOk(res, out, 'Status');
});

export const violationCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user!.sub;

  const { sessionId, type, meta } = req.body as {
    sessionId: string;
    type: ViolationType; // <-- use the union type
    meta?: Record<string, unknown>;
  };

  const out = await recordViolation({
    userId,
    sessionId,
    type,
    ...(meta ? { meta } : {}),
  });

  emitSessionViolation(sessionId, { type, occurredAt: new Date().toISOString() });

  return sendOk(res, out, 'Violation recorded');
});


```

```javascript
// src/controllers/question.controller.ts
import type { Request, RequestHandler, Response } from 'express';
import multer from 'multer';
import { asyncHandler } from '../utils/asyncHandler';
import { logAudit } from '../services/audit.service';
import {
  listQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  importQuestions,
   type ImportRow,
} from '../services/question.service';
import { parseCsvBuffer, sendCsv } from '../utils/csv';
import { type Level, Question } from '../models/Question';

type MulterFile = Express.Multer.File;

export const listCtrl = asyncHandler(async (req: Request, res: Response) => {
  // level: typed w/out any
  const levelParam = typeof req.query.level === 'string' ? req.query.level.toUpperCase() : undefined;
  const allowedLevels = new Set<Level>(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
  const level = levelParam && allowedLevels.has(levelParam as Level) ? (levelParam as Level) : undefined;

  // isActive: robust coercion
  const isActive =
    typeof req.query.isActive === 'string'
      ? req.query.isActive === 'true'
      : typeof req.query.isActive === 'boolean'
        ? req.query.isActive
        : undefined;

  // Build options object without undefined fields
  const opts: Parameters<typeof listQuestions>[0] = {
    ...(req.query.page ? { page: Number(req.query.page) } : {}),
    ...(req.query.limit ? { limit: Number(req.query.limit) } : {}),
    ...(req.query.q ? { q: String(req.query.q) } : {}),
    ...(level ? { level } : {}),
    ...(req.query.competencyId ? { competencyId: String(req.query.competencyId) } : {}),
    ...(isActive !== undefined ? { isActive } : {}),
    ...(req.query.sortBy ? { sortBy: req.query.sortBy as 'createdAt' | 'level' | 'prompt' } : {}),
    ...(req.query.sortOrder ? { sortOrder: req.query.sortOrder as 'asc' | 'desc' } : {}),
  };

  const { items, meta } = await listQuestions(opts);
  return res.paginated(items, meta);
});


type IdParams = { id: string };

export const getCtrl: RequestHandler<IdParams> = asyncHandler(async (req, res) => {
  const { id } = req.params as IdParams;
  const q = await getQuestion(id);
  if (!q) return res.status(404).json({ success: false, code: 'NOT_FOUND', message: 'Question not found' });
  return res.ok({ question: q });
});

/** ---------- CREATE */
export const createCtrl = asyncHandler(async (req, res) => {
  const q = await createQuestion(req.body);
  // If your logAudit is (actorId, action, target?, meta?), keep this:
  await logAudit(req.user!.sub, 'QUESTION_CREATE', { type: 'Question', id: q._id.toString() });
  // If your logAudit is (actorId, action, meta?), use:
  // await logAudit(req.user!.sub, 'QUESTION_CREATE', { id: q._id.toString() });
  return res.created({ question: q }, 'Question created');
});

/** ---------- UPDATE /:id */
export const updateCtrl: RequestHandler<IdParams> = asyncHandler(async (req, res) => {
  const { id } = req.params as IdParams;
  const q = await updateQuestion(id, req.body);

  // match your logAudit signature (see comment above)
  await logAudit(
    req.user!.sub,
    'QUESTION_UPDATE',
    { type: 'Question', id: q._id.toString() },
    { patch: req.body },
  );
  // or: await logAudit(req.user!.sub, 'QUESTION_UPDATE', { id: q._id.toString(), patch: req.body });

  return res.ok({ question: q }, 'Updated');
});

/** ---------- DELETE /:id */
export const deleteCtrl: RequestHandler<IdParams> = asyncHandler(async (req, res) => {
  const { id } = req.params as IdParams;
  const deleted = await deleteQuestion(id);
  // match your logAudit signature
  await logAudit(req.user!.sub, 'QUESTION_DELETE', { type: 'Question', id });
  // or: await logAudit(req.user!.sub, 'QUESTION_DELETE', { id });
  return res.ok({ question: deleted }, 'Question deleted');

});

/** ---------- CSV import/export **/
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
export const importMulter = upload.single('file');

/** Request type that includes `file` (if you don't want global augmentation) */
type RequestWithFile = Request & { file?: MulterFile; files?: MulterFile[] };

export const importCsvCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const file = (req as RequestWithFile).file;
  if (!file) {
    return res.status(400).json({ success: false, code: 'VALIDATION_ERROR', message: 'CSV file is required' });
  }

  // Remove `any`: parse rows as your service ImportRow type
  const rows = await parseCsvBuffer<ImportRow>(file.buffer);
  const mode = (req.query.mode as 'upsert' | 'insert') ?? 'upsert';

  const result = await importQuestions(rows, mode);

  // match your logAudit signature
  await logAudit(req.user!.sub, 'QUESTION_IMPORT', undefined, { mode, ...result });
  // or: await logAudit(req.user!.sub, 'QUESTION_IMPORT', { mode, ...result });

  return res.ok(result, 'Import complete');
});

export const exportCsvCtrl: RequestHandler = asyncHandler(async (req, res) => {
  // Apply same filters as list for export
  const filter: Record<string, unknown> = {};
  if (req.query.level) filter.level = req.query.level;
  if (req.query.competencyId) filter.competencyId = req.query.competencyId;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
  if (req.query.q) filter['$text'] = { $search: String(req.query.q) };

  console.log('req', req.query)

  // For type safety during export
  type PopulatedQuestion = {
    level: Level;
    prompt: string;
    options: string[];
    correctIndex: number;
    isActive: boolean;
    competencyId?: { code?: string; name?: string };
  };

  const cursor = Question.find(filter)
    .populate({ path: 'competencyId', select: 'code name' })
    .cursor();

  async function* toRows() {
    for await (const doc of cursor) {
      const d = doc.toObject() as PopulatedQuestion;
      yield {
        competencyCode: d.competencyId?.code,
        level: d.level,
        prompt: d.prompt,
        option1: d.options?.[0],
        option2: d.options?.[1],
        option3: d.options?.[2],
        option4: d.options?.[3],
        correctIndex: d.correctIndex,
        isActive: d.isActive,
      };
    }
  }

  // match your logAudit signature
  await logAudit(req.user!.sub, 'QUESTION_EXPORT', undefined, { ...filter });
  // or: await logAudit(req.user!.sub, 'QUESTION_EXPORT', { ...filter });

  // If your sendCsv(res, filename, rows) has 3 args, keep as-is:
  return sendCsv(res, 'questions_export.csv', toRows());

  // If your sendCsv only takes (res, rows), then change to:
  // return sendCsv(res, toRows());
});
```

```javascript
// src/controllers/systemConfig.controller.ts
import type { Request, Response } from 'express';
import { SystemConfig, loadSystemConfig } from '../models/SystemConfig';

export async function getSystemConfigCtrl(_req: Request, res: Response) {
  const cfg = await loadSystemConfig();
  return res.json({ success: true, data: cfg });
}

export async function patchSystemConfigCtrl(req: Request, res: Response) {
  // Only set the fields provided (respect exactOptionalPropertyTypes)
  const $set: Record<string, unknown> = {};
  for (const k of ['timePerQuestionSec', 'retakeLockMinutes', 'maxRetakes', 'sebMode'] as const) {
    if (k in req.body) $set[k] = req.body[k];
  }

  const updated = await SystemConfig.findByIdAndUpdate('singleton', { $set }, { new: true, upsert: true });
  return res.json({ success: true, message: 'Config updated', data: updated });
}

```

```javascript
// src/controllers/user.controller.ts
```

```javascript
// src/controllers/video.controller.ts
import type { RequestHandler } from 'express';
import multer from 'multer';
import { asyncHandler } from '../utils/asyncHandler';
import { saveChunk } from '../services/video.service';
import { UploadChunkQuery } from '../validators/exam.validators';
import { AppError } from '../utils/error';

// Multer (memory): simple & safe for < ~10–20MB per chunk.
// If you expect very large chunks, switch to diskStorage.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB/chunk max
});

type MulterReq = Parameters<typeof upload.single>[0];

export const chunkMulter: MulterReq = 'chunk';

export const uploadChunkCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const parsed = UploadChunkQuery.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid query', 400);
  }
  const { sessionId, index } = parsed.data;

  const file = (req as unknown as { file?: Express.Multer.File }).file;
  if (!file || !file.buffer) {
    throw new AppError('VALIDATION_ERROR', 'Missing file field "chunk"', 400);
  }

  const out = await saveChunk({
    userId: req.user!.sub,
    sessionId,
    index,
    buffer: file.buffer,
    mime: file.mimetype,
  });

  return res.ok(out, 'Chunk stored');
});

// Export the multer middleware so routes can compose:
// router.post(..., chunkUploadMulter, uploadChunkCtrl)
export const chunkUploadMulter = upload.single('chunk');

```

```javascript
// src/jobs/autoSubmitExpiredExams.job.ts
import cron from 'node-cron';
import { ExamSession } from '../models/ExamSession';
import { submitExam } from '../services/exam.service';

/** Runs every minute: auto-finalize expired "active" sessions. */
export function scheduleAutoSubmitExpiredExamsJob() {
  cron.schedule('*/1 * * * *', async () => {
    const now = new Date();
    const expired = await ExamSession.find({ status: 'active', deadlineAt: { $lt: now } }).select(
      '_id userId',
    );
    for (const s of expired) {
      try {
        await submitExam({ userId: String(s.userId), sessionId: String(s._id), reason: 'auto' });
      } catch (e) {
        // keep silent, next tick will retry new ones
        console.error('Auto-submit failed for session', String(s._id), e);
      }
    }
  });
}
```

```javascript
// src/jobs/cleanupOldVideos.job.ts
import cron from 'node-cron';
import path from 'node:path';
import fs from 'fs-extra';
import { env } from '../config/env';

/**
 * Deletes session video directories older than a threshold.
 * Run daily at 02:30 AM.
 */
export function scheduleCleanupOldVideosJob(days = 2) {
  cron.schedule('30 2 * * *', async () => {
    const base = env.VIDEO_DIR;
    try {
      const exists = await fs.pathExists(base);
      if (!exists) return;

      const entries = await fs.readdir(base);
      const now = Date.now();
      const cutoff = days * 24 * 60 * 60 * 1000;

      for (const e of entries) {
        const full = path.join(base, e);
        try {
          const stat = await fs.stat(full);
          // If it's a directory and old enough, remove
          if (stat.isDirectory() && now - stat.mtimeMs > cutoff) {
            await fs.remove(full);
          }
        } catch {
          // ignore issues for individual entries
        }
      }
    } catch (err) {
      console.error('Video cleanup job error:', err);
    }
  });
}
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
import type { Request, Response, NextFunction } from 'express';
import type { AccessTokenPayload } from '../utils/jwt';
import { AppError } from '../utils/error';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AccessTokenPayload;
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
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { AppError } from '../utils/error';

declare module 'express-serve-static-core' {
  interface Request {
    sebHeadersPresent?: boolean;
  }
}

/** Minimal SEB guard: in `block` mode, required headers must be present; in `warn`, we allow through. */
export function requireSebHeaders(req: Request, _res: Response, next: NextFunction) {
  const cfg = env.SEB_MODE; // 'block' | 'warn'
  const present = Boolean(
    req.headers['x-safe-exam-browser-configkeyhash'] ||
    req.headers['x-safe-exam-browser-requesthash'],
  );
  req.sebHeadersPresent = present;

  if (cfg === 'block' && !present) {
    throw new AppError('FORBIDDEN', 'Safe Exam Browser required', 403);
  }
  return next();
}

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


function replaceContents(target: Record<string, unknown>, src: Record<string, unknown>) {
  for (const k of Object.keys(target)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (target as Record<string, unknown>)[k];
  }
  for (const [k, v] of Object.entries(src)) {
    (target as Record<string, unknown>)[k] = v;
  }
}

/**
 * Creates an Express middleware for validating request parts
 * using a Zod schema. Returns formatted error responses on failure.
 *
 * @param schema Zod schema or object with keys { body, query, params }
 */
export const validate =
  (schema: ZodTypeAny | SchemaParts) => (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isZodSchema(schema)) {
        // Single schema → validate body
        const result = schema.safeParse(req.body);
        if (!result.success) {
          return sendZodError(res, result.error);
        }
       if (req.body && typeof req.body === 'object') {
          replaceContents(
            req.body as unknown as Record<string, unknown>,
            result.data as unknown as Record<string, unknown>,
          );
        } else {
          // set when body is undefined or not an object
          (req as unknown as { body: unknown }).body = result.data as unknown;
        }
      } else {
        // Multiple parts: body/query/params
        if (schema.body) {
          const parsed = schema.body.safeParse(req.body);
          if (!parsed.success) {
            return sendZodError(res, parsed.error);
          }
              if (req.body && typeof req.body === 'object') {
            replaceContents(
              req.body as unknown as Record<string, unknown>,
              parsed.data as unknown as Record<string, unknown>,
            );
          } else {
            (req as unknown as { body: unknown }).body = parsed.data as unknown;
          }
        }
        if (schema.query) {
           const parsed = schema.query.safeParse(req.query);
          if (!parsed.success) return sendZodError(res, parsed.error);
          // ⚠️ Express 5: mutate, don't assign
        replaceContents(
            req.query as unknown as Record<string, unknown>,
            parsed.data as unknown as Record<string, unknown>,
          );
        }
        if (schema.params) {
          const parsed = schema.params.safeParse(req.params);
          if (!parsed.success) return sendZodError(res, parsed.error);
          // ⚠️ Express 5: mutate, don't assign
            replaceContents(
            req.params as unknown as Record<string, unknown>,
            parsed.data as unknown as Record<string, unknown>,
          );
        }
      }
      return next();
    } catch (err) {
        console.error('Validation middleware error:', err);
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
import { Schema, model,  } from 'mongoose';
import type { Types, Document, HydratedDocument } from 'mongoose';

export interface IAuditLog extends Document {
  _id: Types.ObjectId | string;
  actorId: Types.ObjectId;
  action: string; // e.g. COMPETENCY_CREATE, QUESTION_IMPORT
  target?: { type: string; id: string };
  meta?: Record<string, unknown>;
  createdAt: Date;
}

export type AuditLogDoc = HydratedDocument<IAuditLog>;

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    action: { type: String, required: true, index: true },
    target: {
      type: { type: String },
      id: { type: String },
    },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = model<IAuditLog>('AuditLog', AuditLogSchema);

```

```javascript
// src/models/Certification.ts
import { Schema, model } from 'mongoose';
import type { HydratedDocument, Types } from 'mongoose';
import type { Level } from './Question';

export interface ICertification {
  _id: Types.ObjectId | string;
  userId: Types.ObjectId;
  highestLevel: Level;
  issuedAt: Date;
  certificateId: string; // UUID-ish for public verification
  pdfUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export type CertificationDoc = HydratedDocument<ICertification>;

const CertificationSchema = new Schema<ICertification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true, unique: true },
    highestLevel: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], required: true },
    issuedAt: { type: Date, required: true },
    certificateId: { type: String, required: true, index: true, unique: true },
     pdfUrl: { type: String, default: null },
  },
  { timestamps: true },
);

export const Certification = model<ICertification>('Certification', CertificationSchema);

```

```javascript
// src/models/Competency.ts
import { Schema, model } from 'mongoose';
import type { Types, HydratedDocument } from 'mongoose';

export interface ICompetency extends Document {
  _id: Types.ObjectId | string;
  code: string;             // e.g. "COMP-01" (unique)
  name: string;             // e.g. "Email Security"
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CompetencyDoc = HydratedDocument<ICompetency>;

const CompetencySchema = new Schema<ICompetency>(
  {
    code: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50 },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true },
);

// Helpful indexes for admin search
CompetencySchema.index({ name: 1 });
CompetencySchema.index({ name: 'text', description: 'text' });

export const Competency = model<ICompetency>('Competency', CompetencySchema);

```

```javascript
// src/models/systemConfig.ts
import { Schema, model, type Document } from 'mongoose';

export type SebMode = 'off' | 'warn' | 'enforce';

export interface SystemConfigAttrs {
  timePerQuestionSec: number;     // per question timer
  retakeLockMinutes: number;      // lockout if Step-1 < threshold, etc.
  maxRetakes: number;             // optional policy if you add it later
  sebMode: SebMode;               // off | warn | enforce
}

export interface SystemConfigDoc extends Document, SystemConfigAttrs {
  _id: string; // "singleton"
  createdAt: Date;
  updatedAt: Date;
}

const SystemConfigSchema = new Schema<SystemConfigDoc>(
  {
    _id: { type: String, default: 'singleton' }, // keep it single-document
    timePerQuestionSec: { type: Number, default: 90, min: 30, max: 300 },
    retakeLockMinutes: { type: Number, default: 60, min: 0, max: 24 * 60 },
    maxRetakes: { type: Number, default: 3, min: 0, max: 10 },
    sebMode: { type: String, enum: ['off', 'warn', 'enforce'], default: 'warn' },
  },
  { timestamps: true, versionKey: false }
);

export const SystemConfig = model<SystemConfigDoc>('SystemConfig', SystemConfigSchema);

// Helper for callers that need config with sensible defaults
export async function loadSystemConfig(): Promise<SystemConfigDoc> {
  const existing = await SystemConfig.findById('singleton');
  if (existing) return existing;
  return SystemConfig.create({ _id: 'singleton' });
}

```

```javascript
// src/models/ExamSession.ts
import { Schema, model } from 'mongoose';
import type { Types, HydratedDocument } from 'mongoose';
import type { Level } from './Question';

export type ExamStatus = 'active' | 'submitted' | 'expired' | 'abandoned';

export interface ISessionQuestion {
  questionId: Types.ObjectId;
  competencyId: Types.ObjectId;
  level: Level;
  order: number; // 1..44
}
export interface ISessionAnswer {
  questionId: Types.ObjectId;
  selectedIndex?: number;
  isCorrect?: boolean;
  answeredAt?: Date;
  elapsedMs?: number;
}
export type ViolationType = 'TAB_BLUR' | 'FULLSCREEN_EXIT' | 'COPY' | 'PASTE' | 'RIGHT_CLICK';
export interface IViolationEvent {
  type: ViolationType;
  occurredAt: Date;
  meta?: Record<string, unknown>;
}
export interface IExamSession {
  _id: Types.ObjectId | string;
  userId: Types.ObjectId;
  step: 1 | 2 | 3;
  status: ExamStatus;
  timePerQuestionSec: number;
  totalQuestions: number; // 44
  questions: ISessionQuestion[]; // frozen at start
  answers: ISessionAnswer[]; // updated as user answers
  startAt: Date;
  endAt?: Date;
  deadlineAt: Date; // start + total * timePerQuestion
  scorePct?: number; // computed on submit
  awardedLevel?: Level; // A1..C2 per step thresholds
  violations: IViolationEvent[];
  examClientInfo?: {
    ip?: string;
    userAgent?: string;
    screen?: { width: number; height: number };
    sebHeadersPresent?: boolean;
  };
  videoRecordingMeta?: {
    dir: string;              // chunk directory
    mime?: string | undefined;            // e.g., 'video/webm'
    chunks?: number;          // highest index+1 we've seen (best-effort)
    assembledPath?: string;   // final file path
    sizeBytes?: number;       // final size (assembled)
    completedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type ExamSessionDoc = HydratedDocument<IExamSession>;

const QuestionSub = new Schema<ISessionQuestion>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    competencyId: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    level: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], required: true },
    order: { type: Number, required: true, min: 1, max: 200 },
  },
  { _id: false },
);

const AnswerSub = new Schema<ISessionAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedIndex: { type: Number },
    isCorrect: { type: Boolean },
    answeredAt: { type: Date },
    elapsedMs: { type: Number },
  },
  { _id: false },
);

const ViolationSub = new Schema<IViolationEvent>(
  {
    type: {
      type: String,
      enum: ['TAB_BLUR', 'FULLSCREEN_EXIT', 'COPY', 'PASTE', 'RIGHT_CLICK'],
      required: true,
    },
    occurredAt: { type: Date, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  { _id: false },
);

const ExamSessionSchema = new Schema<IExamSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    step: { type: Number, enum: [1, 2, 3], index: true, required: true },
    status: {
      type: String,
      enum: ['active', 'submitted', 'expired', 'abandoned'],
      index: true,
      default: 'active',
    },
    timePerQuestionSec: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    questions: { type: [QuestionSub], required: true },
    answers: { type: [AnswerSub], required: true, default: [] },
    startAt: { type: Date, required: true },
    endAt: { type: Date },
    deadlineAt: { type: Date, required: true, index: true },
    scorePct: { type: Number },
    awardedLevel: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    violations: { type: [ViolationSub], default: [] },
    examClientInfo: {
      ip: String,
      userAgent: String,
      screen: { width: Number, height: Number },
      sebHeadersPresent: Boolean,
    },
    videoRecordingMeta: {
      dir: { type: String },
      mime: { type: String },
      chunks: { type: Number },
      assembledPath: { type: String },
      sizeBytes: { type: Number },
      completedAt: { type: Date },
    },
  },
  { timestamps: true },
);

ExamSessionSchema.index({ userId: 1, step: 1, status: 1 });
ExamSessionSchema.index({ 'questions.questionId': 1 }, { sparse: true });

export const ExamSession = model<IExamSession>('ExamSession', ExamSessionSchema);

```

```javascript
// src/models/OtpToken.ts
import { Schema, model } from 'mongoose';
import type { Types, HydratedDocument } from 'mongoose';


export type OtpPurpose = 'verify' | 'reset';

export interface IOtpToken extends Document {
  userId: Types.ObjectId;
  channel: 'email';
  otpHash: string;
  purpose: OtpPurpose;
  expiresAt: Date;      // TTL
  consumedAt?: Date;
  createdAt: Date;
}

export type OtpTokenDoc = HydratedDocument<IOtpToken>;

const OtpTokenSchema = new Schema<IOtpToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    channel: { type: String, enum: ['email'], default: 'email' },
    otpHash: { type: String, required: true },
    purpose: { type: String, enum: ['verify', 'reset'], required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    consumedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// TTL index (Mongo will purge expired)
OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpToken = model<IOtpToken>('OtpToken', OtpTokenSchema);

```

```javascript
// src/models/Question.ts
import { Schema, model } from 'mongoose';
import type { Types, HydratedDocument, InferSchemaType } from 'mongoose';

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface IQuestion extends Document {
  _id: Types.ObjectId | string;
  competencyId: Types.ObjectId;
  level: Level;
  prompt: string;
  options: string[]; // typically 4
  correctIndex: number; // 0-based
  isActive: boolean; // default true
  meta?: {
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}



const QuestionSchema = new Schema(
  {
    competencyId: { type: Schema.Types.ObjectId, ref: 'Competency', required: true, index: true },
    level: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      required: true,
      index: true,
    },
    prompt: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    options: {
      type: [String],
      required: true,
      validate: {
        validator(v: unknown[]) {
          return (
            Array.isArray(v) &&
            v.length >= 2 &&
            v.length <= 10 &&
            v.every((s) => typeof s === 'string' && s.trim().length > 0)
          );
        },
        message: 'options must be 2–10 non-empty strings',
      },
    },
    correctIndex: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    meta: {
      difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: false },
      tags: { type: [String], required: false, default: undefined },
    },
  },
  { timestamps: true },
);

// One question per (competency, level) — matches your seed strategy
QuestionSchema.index({ competencyId: 1, level: 1 }, { unique: true });

// NOTE: InferSchemaType includes timestamps as required; make them optional for inserts.
type _QuestionInfer = InferSchemaType<typeof QuestionSchema>;
export type QuestionRaw = Omit<_QuestionInfer, 'createdAt' | 'updatedAt'> & {
  createdAt?: Date;
  updatedAt?: Date;
};

// (Optional) hydrated doc for elsewhere
export type QuestionDoc = HydratedDocument<QuestionRaw>;

export const Question = model<QuestionRaw>('Question', QuestionSchema);

```

```javascript
// src/models/RecordingAsset.ts
import { Schema, model } from 'mongoose';
import type { HydratedDocument, Types } from 'mongoose';

export interface IRecordingAsset {
  _id: Types.ObjectId | string;
  sessionId: Types.ObjectId;
  kind: 'video' | 'audio';
  storagePath: string;     // absolute path (e.g., /tmp/testschool/videos/<session>/recording.webm)
  sizeBytes: number;
  durationSec?: number;
  chunks?: number;
  createdAt: Date;
  completedAt?: Date;
}

export type RecordingAssetDoc = HydratedDocument<IRecordingAsset>;

const RecordingAssetSchema = new Schema<IRecordingAsset>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'ExamSession', index: true, required: true },
    kind: { type: String, enum: ['video', 'audio'], default: 'video' },
    storagePath: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    durationSec: { type: Number },
    chunks: { type: Number },
    completedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

RecordingAssetSchema.index({ sessionId: 1 });

export const RecordingAsset = model<IRecordingAsset>('RecordingAsset', RecordingAssetSchema);

```

```javascript
// src/models/RefreshToken.ts
import { Schema, model } from 'mongoose';
import type { Types, HydratedDocument } from 'mongoose';


export interface IRefreshToken extends Document {
  userId: Types.ObjectId;
  tokenHash: string;            // store hash, never raw token
  expiresAt: Date;
  revokedAt?: Date;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

export type RefreshTokenDoc = HydratedDocument<IRefreshToken>;

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

RefreshTokenSchema.index({ userId: 1, tokenHash: 1 }, { unique: true });

export const RefreshToken = model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

```

```javascript
// src/models/SystemConfig.ts
```

```javascript
// src/models/User.ts
import { Schema, model } from 'mongoose';
import type { Types, HydratedDocument } from 'mongoose';

export type UserRole = 'admin' | 'student' | 'supervisor';
export type UserStatus = 'active' | 'inactive';

export interface IUser extends Document {
   _id: string | Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  passwordHash: string;
  emailVerified: boolean;
  status: UserStatus;
  isLockedFromStep1?: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export type UserDoc = HydratedDocument<IUser>;
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String },
    role: { type: String, enum: ['admin', 'student', 'supervisor'], default: 'student', index: true },
    passwordHash: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
    isLockedFromStep1: { type: Boolean, default: false },
  },
  { timestamps: true },
);



export const User = model<IUser>('User', UserSchema);

```

```javascript
// src/routes/admin.sessions.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { listSessionsCtrl, getSessionCtrl } from '../controllers/admin.sessions.controller';
import { ListSessionsQuery, SessionIdParams } from '../validators/admin.sessions.validators';

const router = Router();

router.use(requireAuth, requireRole('admin', 'supervisor'));

router.get('/', validate(ListSessionsQuery), listSessionsCtrl);
router.get('/:id', validate(SessionIdParams), getSessionCtrl);

export default router;
```

```javascript
// src/routes/auth.routes.ts
import { Router } from 'express';

import { validate } from '../middleware/validation.middleware';
import {
  RegisterSchema,
  LoginSchema,
  RefreshSchema,
  LogoutSchema,
  SendOtpSchema,
  VerifyOtpSchema,
  ForgotSchema,
  ResetSchema,
} from '../validators/auth.validators';
import {
  register,
  login,
  refresh,
  logout,
  sendOtpCtrl,
  verifyOtpCtrl,
  forgot,
  reset,
} from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rate-limit';

const router = Router();

router.post('/register', authLimiter, validate(RegisterSchema), register);
router.post('/login', authLimiter, validate(LoginSchema), login);
router.post('/token/refresh', authLimiter, validate(RefreshSchema), refresh);
router.post('/logout', validate(LogoutSchema), logout);

router.post('/otp/send', authLimiter, validate(SendOtpSchema), sendOtpCtrl);
router.post('/otp/verify', authLimiter, validate(VerifyOtpSchema), verifyOtpCtrl);
router.post('/otp/resend', authLimiter, validate(SendOtpSchema), sendOtpCtrl);

router.post('/forgot', authLimiter, validate(ForgotSchema), forgot);
router.post('/reset', authLimiter, validate(ResetSchema), reset);

export default router;
```

```javascript
// src/routes/certification.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { meCtrl, getByIdCtrl, verifyCtrl, pdfCtrl } from '../controllers/certification.controller';
import { CertIdParams, VerifyPublicIdParams } from '../validators/certification.validators';

const router = Router();

// Public verify by certificateId
router.get('/verify/:certificateId', validate({ params: VerifyPublicIdParams }), verifyCtrl);

// Authenticated
router.use(requireAuth);

// Student: my cert
router.get('/me', requireRole('student'), meCtrl);

// Admin/Supervisor: read by _id
router.get(
  '/:id',
  requireRole('admin', 'supervisor'),
  validate({ params: CertIdParams }),
  getByIdCtrl,
);

// Admin or owner: download PDF
router.get('/:id/pdf', validate({ params: CertIdParams }), pdfCtrl);

export default router;
```

```javascript
// src/routes/competency.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createCtrl,
  deleteCtrl,
  getCtrl,
  listCtrl,
  updateCtrl,
} from '../controllers/competency.controller';
import {
  CreateCompetencySchema,
  UpdateCompetencySchema,
  ListCompetencyQuery,
  CompetencyIdParams,
} from '../validators/competency.validators';

const router = Router();

router.use(requireAuth);

// list (admin, supervisor)
router.get(
  '/',
  (req, _res, next) => {
    console.log('RAW URL →', req.originalUrl); // should show ?q=...&page=... if sent
    next();
  },
  requireRole('admin', 'supervisor'),
  validate({ query: ListCompetencyQuery }),
  listCtrl,
);

// create (admin)
router.post('/', requireRole('admin'), validate(CreateCompetencySchema), createCtrl);

// get one (admin, supervisor)
router.get(
  '/:id',
  requireRole('admin', 'supervisor'),
  validate({ params: CompetencyIdParams }),
  getCtrl,
);

// update (admin)
router.patch(
  '/:id',
  requireRole('admin'),
  validate({ params: CompetencyIdParams, body: UpdateCompetencySchema }),
  updateCtrl,
);

// delete (admin)
router.delete('/:id', requireRole('admin'), validate({ params: CompetencyIdParams }), deleteCtrl);

export default router;
```

```javascript
// src/routes/config.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { getSystemConfigCtrl, patchSystemConfigCtrl } from '../controllers/systemConfig.controller';
import { PatchSystemConfigSchema } from '../validators/systemConfig.validators';

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get('/', getSystemConfigCtrl);
router.patch('/', validate(PatchSystemConfigSchema), patchSystemConfigCtrl);

export default router;
```

```javascript
// src/routes/exam.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { requireSebHeaders } from '../middleware/seb.middleware';
import {
  StartExamQuery,
  StartExamBody,
  AnswerBody,
  SubmitBody,
  ViolationBody,
  SessionIdParams,
  UploadChunkQuery,
} from '../validators/exam.validators';
import {
  startCtrl,
  answerCtrl,
  submitCtrl,
  statusCtrl,
  violationCtrl,
} from '../controllers/exam.controller';

import { chunkUploadMulter, uploadChunkCtrl } from '../controllers/video.controller';

const router = Router();

router.use(requireAuth);
router.use(requireRole('student'));

// Start (step comes in query). Enforce SEB guard here.
router.post(
  '/start',
  requireSebHeaders,
  validate({ query: StartExamQuery, body: StartExamBody }),
  startCtrl,
);

// Answer within time window
router.post('/answer', requireSebHeaders, validate(AnswerBody), answerCtrl);

// Submit
router.post('/submit', requireSebHeaders, validate(SubmitBody), submitCtrl);

// Status
router.get('/status/:sessionId', validate({ params: SessionIdParams }), statusCtrl);

// Violations (allow even if SEB warn mode)
router.post('/violation', validate(ViolationBody), violationCtrl);

router.post(
  '/video/upload-chunk',
  validate({ query: UploadChunkQuery }),
  chunkUploadMulter,
  uploadChunkCtrl,
);

export default router;
```

```javascript
// src/routes/index.ts
import { Router } from 'express';

import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import competencyRoutes from './competency.routes';
import questionRoutes from './question.routes';
import examRoutes from './exam.routes';
import certificationRoutes from './certification.routes';
import adminConfigRoutes from './config.routes';
import adminSessionsRoutes from './admin.sessions.routes';

const router = Router();

router.get('/health', (_req, res) => res.ok({ ok: true }));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/competencies', competencyRoutes);
router.use('/questions', questionRoutes);
router.use('/exam', examRoutes);
router.use('/certifications', certificationRoutes);
router.use('/admin/config', adminConfigRoutes);
router.use('/admin/sessions', adminSessionsRoutes);

export default router;
```

```javascript
// src/routes/question.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  listCtrl,
  getCtrl,
  createCtrl,
  updateCtrl,
  deleteCtrl,
  importCsvCtrl,
  exportCsvCtrl,
  importMulter,
} from '../controllers/question.controller';
import {
  CreateQuestionSchema,
  UpdateQuestionSchema,
  ListQuestionQuery,
  QuestionIdParams,
  ImportQuery,
} from '../validators/question.validators';

const router = Router();

router.use(requireAuth);

// CSV import/export (admin)
router.post(
  '/import',
  requireRole('admin'),
  validate({ query: ImportQuery }),
  importMulter,
  importCsvCtrl,
);
router.get('/export', requireRole('admin'), exportCsvCtrl);

// list/read (admin, supervisor)
router.get(
  '/',
  requireRole('admin', 'supervisor'),
  validate({ query: ListQuestionQuery }),
  listCtrl,
);
router.get(
  '/:id',
  requireRole('admin', 'supervisor'),
  validate({ params: QuestionIdParams }),
  getCtrl,
);

// create/update/delete (admin)
router.post('/', requireRole('admin'), validate(CreateQuestionSchema), createCtrl);
router.patch(
  '/:id',
  requireRole('admin'),
  validate({ params: QuestionIdParams, body: UpdateQuestionSchema }),
  updateCtrl,
);
router.delete('/:id', requireRole('admin'), validate({ params: QuestionIdParams }), deleteCtrl);

export default router;
```

```javascript
// src/routes/user.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', requireAuth, (req, res) => {
  return res.ok({ user: req.user }, 'Current user');
});

export default router;
```

```javascript
// src/seed/seedAdmin.ts
import { connectDB } from '../config/db';
import { env } from '../config/env';
import { User } from '../models/User';
import { hashPassword } from '../utils/hasher';

async function run() {
  await connectDB();
  const email = env.SEED_ADMIN_EMAIL;
  const name = env.SEED_ADMIN_NAME;
  const pass = env.SEED_ADMIN_PASS;

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  const passwordHash = await hashPassword(pass);
  await User.create({
    name,
    email,
    passwordHash,
    role: 'admin',
    emailVerified: true,
    status: 'active',
  });

  console.log('✅ Admin created:', email, 'password:', pass);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

```javascript
// src/seed/seedCompetencies.ts
import { connectDB } from '../config/db';
import { Competency } from '../models/Competency'; // expects fields: code (unique), name, description?

const COMPETENCIES: Array<{ code: string; name: string; description?: string }> = [
  { code: 'COMP-01', name: 'Email Security' },
  { code: 'COMP-02', name: 'Password Management' },
  { code: 'COMP-03', name: 'Phishing Awareness' },
  { code: 'COMP-04', name: 'Safe Web Browsing' },
  { code: 'COMP-05', name: 'Device Security' },
  { code: 'COMP-06', name: 'Software Updates' },
  { code: 'COMP-07', name: 'Data Backup' },
  { code: 'COMP-08', name: 'Cloud Storage Basics' },
  { code: 'COMP-09', name: 'Document Editing' },
  { code: 'COMP-10', name: 'Spreadsheets' },
  { code: 'COMP-11', name: 'Presentations' },
  { code: 'COMP-12', name: 'File Management' },
  { code: 'COMP-13', name: 'Networking Basics' },
  { code: 'COMP-14', name: 'Online Communication Etiquette' },
  { code: 'COMP-15', name: 'Video Conferencing' },
  { code: 'COMP-16', name: 'Digital Footprint' },
  { code: 'COMP-17', name: 'Privacy Settings' },
  { code: 'COMP-18', name: 'Social Media Safety' },
  { code: 'COMP-19', name: 'Cyber Hygiene' },
  { code: 'COMP-20', name: 'Mobile Security' },
  { code: 'COMP-21', name: 'Two‑Factor Authentication' },
  { code: 'COMP-22', name: 'Incident Reporting' },
];

async function run() {
  await connectDB();

  const ops = COMPETENCIES.map((c) => ({
    updateOne: {
      filter: { code: c.code },
      update: {
        $setOnInsert: {
          code: c.code,
          name: c.name,
          ...(c.description ? { description: c.description } : {}),
        },
      },
      upsert: true,
    },
  }));

  const res = await Competency.bulkWrite(ops, { ordered: false });

  const inserted = (res.upsertedCount ?? 0);
  const matched = (res.matchedCount ?? 0);
  console.log(`✅ Competencies seeding complete. Inserted: ${inserted}, matched existing: ${matched}`);
  process.exit(0);
}

run().catch((e) => {
  console.error('Competencies seed failed:', e);
  process.exit(1);
});

```

```javascript
// src/seed/seedQuestions.ts
import { Types } from 'mongoose';
import { connectDB } from '../config/db';
import { Competency } from '../models/Competency';
import { Question } from '../models/Question';

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/**
 * Optional helper to assign a rough difficulty by level.
 */
function difficultyFor(level: Level): 'easy' | 'medium' | 'hard' {
  if (level === 'A1' || level === 'A2') return 'easy';
  if (level === 'B1' || level === 'B2') return 'medium';
  return 'hard';
}

function makeOptions(level: Level, compName: string): string[] {
  // Keep deterministic to make upserts stable
  return [
    `Correct practice for ${compName} at ${level}`,
    `Irrelevant step for ${compName}`,
    `Risky approach to ${compName}`,
    `Outdated method for ${compName}`,
  ];
}

async function run() {
  await connectDB();

  const competencies = await Competency.find({}, { _id: 1, code: 1, name: 1 }).lean();
  if (competencies.length === 0) {
    console.error('No competencies found. Run seedCompetencies.ts first.');
    process.exit(1);
  }

  const ops = competencies.flatMap((c) =>
    LEVELS.map((lvl) => {
      const prompt = `[${c.code} • ${lvl}] Choose the best answer related to "${c.name}".`;
      const options = makeOptions(lvl, c.name);

      return {
        updateOne: {
          // Use (competencyId, level) as the natural key. We keep one MCQ per level per competency.
          filter: { competencyId: new Types.ObjectId(c._id), level: lvl },
          update: {
            $setOnInsert: {
              competencyId: new Types.ObjectId(c._id),
              level: lvl,
              prompt,
              options,
              correctIndex: 0,
              isActive: true,
              meta: { difficulty: difficultyFor(lvl), tags: [c.code, c.name] },
            },
          },
          upsert: true,
        },
      };
    }),
  );

  const res = await Question.bulkWrite(ops, { ordered: false });

  const inserted = (res.upsertedCount ?? 0);
  const matched = (res.matchedCount ?? 0);
  // Expecting 22 * 6 = 132 questions total after first run
  console.log(`✅ Questions seeding complete. Inserted: ${inserted}, matched existing: ${matched}`);
  process.exit(0);
}

run().catch((e) => {
  console.error('Questions seed failed:', e);
  process.exit(1);
});

```

```javascript
import { Types } from 'mongoose';
import { AuditLog } from '../models/AuditLog';

export async function logAudit(
  actorId: string,
  action: string,
  target?: { type: string; id: string },
  meta?: Record<string, unknown>,
) {
  await AuditLog.create({
    actorId: new Types.ObjectId(actorId),
    action,
    target,
    meta,
  });
}

```

```javascript
// src/services/auth.service.ts
import crypto from 'node:crypto';
import { Types } from 'mongoose';
import { User } from '../models/User';
import { OtpToken } from '../models/OtpToken';
import { RefreshToken } from '../models/RefreshToken';
import { hashPassword, comparePassword } from '../utils/hasher';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  type AccessTokenPayload,
} from '../utils/jwt';
import { sendOtpEmail, sendResetConfirmation } from './mailer.service';
import { AppError } from '../utils/error';
import { env } from '../config/env';

function hashRefreshForDB(token: string) {
  // Use a fast, one-way hash for DB storage (not bcrypt – we just need lookup)
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function registerUser(params: { name: string; email: string; password: string }) {
  const exists = await User.findOne({ email: params.email });
  if (exists) throw new AppError('CONFLICT', 'Email already registered', 409);

  const passwordHash = await hashPassword(params.password);
  const user = await User.create({
    name: params.name,
    email: params.email,
    passwordHash,
    role: 'student',
    emailVerified: false,
    status: 'active',
  });
  // send verification OTP (optional)
  const otp = await issueOtp(user._id.toString(), 'verify');
  await sendOtpEmail(user.email, otp, 'verify');

  return user;
}

export async function loginUser(params: { email: string; password: string }) {
  const user = await User.findOne({ email: params.email });
  if (!user) throw new AppError('UNAUTHORIZED', 'Invalid credentials', 401);
  if (user.status !== 'active') throw new AppError('FORBIDDEN', 'Account disabled', 403);

  const ok = await comparePassword(params.password, user.passwordHash);
  if (!ok) throw new AppError('UNAUTHORIZED', 'Invalid credentials', 401);

  const tokens = await issueTokens(user._id.toString(), user.role);
  return { user, ...tokens };
}

export async function issueTokens(userId: string, role: AccessTokenPayload['role']) {
  const jti = crypto.randomUUID();
  const access = signAccessToken({ sub: userId, role, jti });

  const refreshJti = crypto.randomUUID();
  const refresh = signRefreshToken({ sub: userId, jti: refreshJti });
  const tokenHash = hashRefreshForDB(refresh);
  const expiresAt = new Date(Date.now() + parseExpiryMs(env.JWT_REFRESH_EXPIRES_IN));

  await RefreshToken.create({
    userId: new Types.ObjectId(userId),
    tokenHash,
    expiresAt,
  });

  return { accessToken: access, refreshToken: refresh };
}

export async function rotateRefreshToken(rawToken: string) {
  const decoded = verifyRefreshToken(rawToken); // throws if invalid or wrong typ
  const tokenHash = hashRefreshForDB(rawToken);

  // Check not revoked/expired in DB
  const doc = await RefreshToken.findOne({ userId: decoded.sub, tokenHash });
  if (!doc || doc.revokedAt || doc.expiresAt < new Date()) {
    throw new AppError('UNAUTHORIZED', 'Invalid refresh token', 401);
  }

  // Revoke old & issue new pair
  doc.revokedAt = new Date();
  await doc.save();

  const user = await User.findById(decoded.sub);
  if (!user) throw new AppError('UNAUTHORIZED', 'User not found', 401);

  return issueTokens(user._id.toString(), user.role);
}

export async function logoutUser(rawToken?: string) {
  if (!rawToken) return;
  const tokenHash = hashRefreshForDB(rawToken);
  await RefreshToken.updateMany({ tokenHash, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } });
}

export async function issueOtp(userId: string, purpose: 'verify' | 'reset') {
  const otp = generateOtp(6);
  const otpHash = await hashPassword(otp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await OtpToken.create({
    userId: new Types.ObjectId(userId),
    channel: 'email',
    otpHash,
    purpose,
    expiresAt,
  });

  return otp;
}

export async function sendOtp(email: string, purpose: 'verify' | 'reset') {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('NOT_FOUND', 'User not found', 404);

  const otp = await issueOtp(user._id.toString(), purpose);
  await sendOtpEmail(user.email, otp, purpose);
  return { sent: true };
}

export async function verifyOtp(email: string, otp: string, purpose: 'verify' | 'reset') {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('NOT_FOUND', 'User not found', 404);

  const record = await OtpToken.findOne({
    userId: user._id,
    purpose,
    consumedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!record) throw new AppError('UNAUTHORIZED', 'OTP expired or not found', 401);

  const ok = await comparePassword(otp, record.otpHash);
  if (!ok) throw new AppError('UNAUTHORIZED', 'Invalid OTP', 401);

  record.consumedAt = new Date();
  await record.save();

  if (purpose === 'verify') {
    user.emailVerified = true;
    await user.save();
  }

  return { verified: true };
}

export async function forgotPassword(email: string) {
  const user = await User.findOne({ email });
  if (!user) return { sent: true }; // do not leak existence

  const otp = await issueOtp(user._id.toString(), 'reset');
  await sendOtpEmail(user.email, otp, 'reset');
  return { sent: true };
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('NOT_FOUND', 'User not found', 404);

  // verify OTP with purpose reset
  const res = await verifyOtp(email, otp, 'reset');
  if (!res.verified) throw new AppError('UNAUTHORIZED', 'Invalid OTP', 401);

  const passwordHash = await hashPassword(newPassword);
  user.passwordHash = passwordHash;
  await user.save();

  // revoke all refresh tokens
  await RefreshToken.updateMany({ userId: user._id, revokedAt: { $exists: false } }, { $set: { revokedAt: new Date() } });
  await sendResetConfirmation(user.email);

  return { reset: true };
}

function generateOtp(len: number) {
  const bytes = crypto.randomBytes(len);
  return Array.from(bytes, (b) => (b % 10).toString()).join('');
}

function parseExpiryMs(v: string | number): number {
  if (typeof v === 'number') return v * 1000; // if number, assume seconds
  // allow "7d", "15m", "3600" etc — jsonwebtoken accepts these but our env is validated as string|number
  // here we just handle simple cases; fallback to seconds
  const m = /^(\d+)([smhd])?$/.exec(v);
  if (!m) return Number(v) * 1000;

  const n = Number(m[1]);
  const unit = (m[2] ?? 's') as 's' | 'm' | 'h' | 'd';
  const map: Record<'s' | 'm' | 'h' | 'd', number> = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  return n * map[unit];
}

```

```javascript
// src/services/certification.service.ts
import path from 'node:path';
import fs from 'fs-extra';
import crypto from 'node:crypto';
import { Types } from 'mongoose';

import { Certification, type CertificationDoc } from '../models/Certification';
import { User } from '../models/User';
import type { Level } from '../models/Question';
import { env } from '../config/env';
import { AppError } from '../utils/error';
import { generateCertificatePDF } from '../utils/pdf';

/** Return the single (highest) certification for a user, if present. */
export function getMyCertification(userId: string) {
  return Certification.findOne({ userId: new Types.ObjectId(userId) });
}

export function getCertificationById(id: string) {
  return Certification.findById(id);
}

export async function verifyByPublicId(certificateId: string) {
  const cert = await Certification.findOne({ certificateId });
  if (!cert) throw new AppError('NOT_FOUND', 'Certificate not found', 404);

  const user = await User.findById(cert.userId).lean();
  return {
    certificateId: cert.certificateId,
    highestLevel: cert.highestLevel,
    issuedAt: cert.issuedAt,
    user: user ? { name: user.name, email: user.email } : undefined,
  };
}

/** Ensure a PDF exists for the certification; generate/update and persist path. */
export async function ensurePdfForCertificate(certId: string): Promise<CertificationDoc> {
  const cert = await Certification.findById(certId);
  if (!cert) throw new AppError('NOT_FOUND', 'Certificate not found', 404);

  const user = await User.findById(cert.userId).lean();
  if (!user) throw new AppError('NOT_FOUND', 'User not found', 404);

  const dir = path.join(env.UPLOAD_DIR, 'certificates', String(cert.userId));
  const outPath = path.join(dir, `${cert.certificateId}.pdf`);

  const needGen =
    !cert.pdfUrl ||
    cert.pdfUrl !== outPath ||
    !(await fs.pathExists(cert.pdfUrl).catch(() => false));

  if (needGen) {
    await generateCertificatePDF({
      outPath,
      name: user.name,
      email: user.email,
      level: cert.highestLevel,
      issuedAt: cert.issuedAt,
      certificateId: cert.certificateId,
    });
    cert.pdfUrl = outPath;
    await cert.save();
  }
  return cert;
}

/** Upsert and keep the user's highest achieved level; regenerate cert/pdf if level increases. */
export async function updateHighestCertificate(userId: string, highest: Level) {
  // Fetch current
  const existing = await Certification.findOne({ userId: new Types.ObjectId(userId) });
  const levelOrder: Level[] = ['A1','A2','B1','B2','C1','C2'];
  const isHigher = !existing || levelOrder.indexOf(highest) > levelOrder.indexOf(existing.highestLevel);

  if (!existing) {
    const doc = await Certification.create({
      userId: new Types.ObjectId(userId),
      highestLevel: highest,
      issuedAt: new Date(),
      certificateId: crypto.randomUUID(),
    });
    await ensurePdfForCertificate(String(doc._id));
    return doc;
  }

  if (!isHigher) {
    // Still ensure PDF exists (might be missing after clean deploy)
    await ensurePdfForCertificate(String(existing._id));
    return existing;
  }

  existing.highestLevel = highest;
  existing.issuedAt = new Date();
  existing.certificateId = crypto.randomUUID(); // new public id per new level
  existing.pdfUrl = null; // force regeneration
  await existing.save();
  await ensurePdfForCertificate(String(existing._id));
  return existing;
}

```

```javascript
// src/services/competency.service.ts
import { Competency } from '../models/Competency';
import { Question } from '../models/Question';
import { AppError } from '../utils/error';

type ListOpts = {
  page?: number;
  limit?: number;
  q?: string;
  sortBy?: 'name' | 'code' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};

export async function listCompetencies(opts: ListOpts) {
  const page = Math.max(opts.page ?? 1, 1);
  const limit = Math.min(opts.limit ?? 10, 100);
  const skip = (page - 1) * limit;

  const filter =
    opts.q && opts.q.trim()
      ? {
          $or: [
            { name: { $regex: opts.q, $options: 'i' } },
            { code: { $regex: opts.q, $options: 'i' } },
            { description: { $regex: opts.q, $options: 'i' } },
          ],
        }
      : {};

  const sort: Record<string, 1 | -1> = {
    [opts.sortBy ?? 'createdAt']: (opts.sortOrder ?? 'desc') === 'asc' ? 1 : -1,
  };

  const [items, total] = await Promise.all([
    Competency.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Competency.countDocuments(filter),
  ]);

  return { items, meta: { page, limit, total } };
}

export async function createCompetency(data: {
  code: string;
  name: string;
  description?: string;
}) {
  const exists = await Competency.findOne({ code: data.code });
  if (exists) throw new AppError('CONFLICT', 'Code already exists', 409);
  return Competency.create(data);
}

export async function getCompetency(id: string) {
  const c = await Competency.findById(id);
  if (!c) throw new AppError('NOT_FOUND', 'Competency not found', 404);
  return c;
}

export async function updateCompetency(id: string, data: Partial<{ code: string; name: string; description?: string }>) {
  const c = await Competency.findByIdAndUpdate(id, data, { new: true });
  if (!c) throw new AppError('NOT_FOUND', 'Competency not found', 404);
  return c;
}

export async function deleteCompetency(id: string) {
  const inUse = await Question.countDocuments({ competencyId: id });
  console.log('inUse', inUse)
  if (inUse > 0) {
    throw new AppError('CONFLICT', 'Competency has questions; delete/transfer questions first', 409);
  }
  const res = await Competency.findByIdAndDelete(id);
  console.log('res', res)
  if (!res) throw new AppError('NOT_FOUND', 'Competency not found', 404);
  return res
}

```

```javascript
// src/services/exam.service.ts
import crypto from 'node:crypto';
import { Types } from 'mongoose';
import { env } from '../config/env';
import { AppError } from '../utils/error';
import { type Level, Question } from '../models/Question';
import { ExamSession, type ExamStatus as SessionStatus ,  type IViolationEvent } from '../models/ExamSession';
import { User } from '../models/User';
import { mapScoreToLevel, maxLevel } from './scoring.service';
import { assembleChunks } from './video.service';
import { updateHighestCertificate } from './certification.service';

type FinalExamStatus = Exclude<SessionStatus, 'active'>;

export type SubmitExamResult = {
  sessionId: string;
  status: FinalExamStatus;         // always a final/non-active status
  scorePct: number;
  proceedNext: boolean;
  awardedLevel?: Level;
  already?: true;          // <-- returned if user tries to submit a non-active session
};

function levelsForStep(step: 1 | 2 | 3) {
  if (step === 1) return ['A1', 'A2'] as const;
  if (step === 2) return ['B1', 'B2'] as const;
  return ['C1', 'C2'] as const;
}

export async function ensureEligibility(userId: string, step: 1 | 2 | 3) {
  const user = await User.findById(userId).lean();
  if (!user) throw new AppError('UNAUTHORIZED', 'User not found', 401);

  if (step === 1) {
    if (user.isLockedFromStep1) throw new AppError('FORBIDDEN', 'Locked from retaking Step 1', 403);
    return;
  }

  // Steps 2 & 3 require >=75% in previous step
  const prevStep = (step - 1) as 1 | 2;
  const prev = await ExamSession.findOne({
    userId,
    step: prevStep,
    status: { $in: ['submitted', 'expired'] },
  })
    .sort({ createdAt: -1 })
    .lean();

  if (!prev || (prev.scorePct ?? 0) < 75) {
    throw new AppError('FORBIDDEN', `Not eligible for Step ${step}`, 403);
  }
}

export async function startExam(params: {
  userId: string;
  step: 1 | 2 | 3;
  client: {
    ip?: string;
    userAgent?: string;
    screen?: { width: number; height: number };
    sebHeadersPresent?: boolean;
  };
}) {
  const { userId, step, client } = params;
  await ensureEligibility(userId, step);

  const [l1, l2] = levelsForStep(step);
  const questions = await Question.find({ level: { $in: [l1, l2] }, isActive: true })
    .select('_id competencyId level')
    .lean();

  if (questions.length !== 44) {
    // per spec: 22 competencies × 2 levels = 44
    throw new AppError(
      'CONFLICT',
      `Expected 44 questions for step ${step}, found ${questions.length}`,
      409,
    );
  }

  // Shuffle to randomize order, but stable enough
  const shuffled = [...questions].sort(() => (crypto.randomInt(0, 2) ? 1 : -1));

  const timePerQuestionSec = env.TIME_PER_QUESTION_SECONDS;
  const totalQuestions = shuffled.length;
  const startAt = new Date();
  const deadlineAt = new Date(startAt.getTime() + totalQuestions * timePerQuestionSec * 1000);

  const session = await ExamSession.create({
    userId: new Types.ObjectId(userId),
    step,
    status: 'active',
    timePerQuestionSec,
    totalQuestions,
    questions: shuffled.map((q, i) => ({
      questionId: q._id,
      competencyId: q.competencyId,
      level: q.level,
      order: i + 1,
    })),
    answers: shuffled.map((q) => ({ questionId: q._id })),
    startAt,
    deadlineAt,
    violations: [],
    examClientInfo: {
      ip: client.ip,
      userAgent: client.userAgent,
      screen: client.screen,
      sebHeadersPresent: client.sebHeadersPresent ?? false,
    },
  });

  // Return without correct answers
  return {
    sessionId: String(session._id),
    step,
    timePerQuestionSec,
    totalQuestions,
    deadlineAt,
    questions: session.questions.map((sq) => ({
      questionId: String(sq.questionId),
      competencyId: String(sq.competencyId),
      level: sq.level,
      order: sq.order,
    })),
  };
}

export async function answerQuestion(params: {
  userId: string;
  sessionId: string;
  questionId: string;
  selectedIndex: number;
  elapsedMs?: number;
}) {
  const { userId, sessionId, questionId, selectedIndex, elapsedMs } = params;

  const session = await ExamSession.findOne({ _id: sessionId, userId });
  if (!session) throw new AppError('NOT_FOUND', 'Session not found', 404);
  if (session.status !== 'active') throw new AppError('FORBIDDEN', 'Session not active', 403);

  const now = new Date();
  if (now > session.deadlineAt) {
    session.status = 'expired';
    session.endAt = now;
    await session.save();
    throw new AppError('FORBIDDEN', 'Session time elapsed', 403);
  }

  // Validate index against actual question options length
  const q = await Question.findById(questionId).select('options').lean();
  if (!q) throw new AppError('NOT_FOUND', 'Question not found', 404);
  if (selectedIndex < 0 || selectedIndex >= (q.options?.length ?? 0)) {
    throw new AppError('VALIDATION_ERROR', 'selectedIndex out of bounds', 400);
  }

  const ans = session.answers.find((a) => String(a.questionId) === String(questionId));
  if (!ans) throw new AppError('VALIDATION_ERROR', 'Question not in session', 400);

  ans.selectedIndex = selectedIndex;
  ans.answeredAt = now;
  if (typeof elapsedMs === 'number') ans.elapsedMs = elapsedMs;

  await session.save();

  return { saved: true };
}

export async function recordViolation(params: {
  userId: string;
  sessionId: string;
  type: 'TAB_BLUR' | 'FULLSCREEN_EXIT' | 'COPY' | 'PASTE' | 'RIGHT_CLICK';
  meta?: Record<string, unknown>;
}) {
  const { userId, sessionId, type, meta } = params;
  const session = await ExamSession.findOne({ _id: sessionId, userId });
  if (!session) throw new AppError('NOT_FOUND', 'Session not found', 404);
  if (session.status !== 'active') return { saved: false };

  const v: IViolationEvent = { type, occurredAt: new Date() };
  if (meta !== undefined) v.meta = meta; // only set when present

  session.violations.push(v);
  await session.save();
  return { saved: true, violations: session.violations.length };
}
export async function submitExam(params: {
  userId: string;
  sessionId: string;
  reason?: 'auto' | 'user';
}): Promise<SubmitExamResult> {
  const { userId, sessionId} = params;
  const session = await ExamSession.findOne({ _id: sessionId, userId });
  if (!session) throw new AppError('NOT_FOUND', 'Session not found', 404);

 if (session.status !== 'active') {
    const allowed: readonly FinalExamStatus[] = ['submitted','expired','abandoned'] as const;
    const st = session.status as SessionStatus;
    const safeStatus: FinalExamStatus = allowed.includes(st as FinalExamStatus)
      ? (st as FinalExamStatus)
      : 'submitted';

    return {
      sessionId,
      status: safeStatus,
      scorePct: session.scorePct ?? 0,
      proceedNext: false,
      ...(session.awardedLevel ? { awardedLevel: session.awardedLevel as Level } : {}),
      already: true as const,
    };
  }

  const now = new Date();
  const expired = now > session.deadlineAt;

    // Compute and persist the final status
    const finalStatus: FinalExamStatus = expired ? 'expired' : 'submitted';
  session.status = finalStatus;

  session.endAt = now;

  // Score
  const ids = session.questions.map((q) => q.questionId);
  const bank = await Question.find({ _id: { $in: ids } }, { _id: 1, correctIndex: 1 }).lean();

  const correctById = new Map(bank.map((b) => [String(b._id), b.correctIndex]));

  let correct = 0;
  for (const a of session.answers) {
    const ci = correctById.get(String(a.questionId));
    if (ci !== undefined && a.selectedIndex !== undefined) {
      a.isCorrect = a.selectedIndex === ci;
      if (a.isCorrect) correct += 1;
    } else {
      a.isCorrect = false;
    }
  }
  const scorePct = Math.round((correct / session.totalQuestions) * 10000) / 100; // 2 decimals
  session.scorePct = scorePct;

  const mapped = mapScoreToLevel(session.step as 1|2|3, scorePct);
  const level = mapped.level as Level | undefined;
  const proceedNext = !!mapped.proceedNext;


  if (level) session.awardedLevel = level;

  // Step 1 <25% locks retake
  if (session.step === 1 && scorePct < 25) {
    await User.updateOne({ _id: userId }, { $set: { isLockedFromStep1: true } });
  }

  await session.save();

  type AwardedOnly = { awardedLevel?: Level };
  const prior: AwardedOnly[] = await ExamSession.find({
    userId,
    status: { $in: ['submitted', 'expired', 'auto-submitted', 'closed'] },
  })
  .select('awardedLevel')
  .lean();

  let highest: Level | undefined = undefined;
  for (const s of prior) {
    highest = maxLevel(highest, s.awardedLevel);
  }
  highest = maxLevel(highest, session.awardedLevel);

  if (highest) {
    try {
      await updateHighestCertificate(userId, highest);
    } catch (e) {
      // Non-fatal: scoring should not fail if certificate generation hiccups
      console.error('Certificate update failed for user', userId, e);
    }
  }

  try {
    await assembleChunks({ sessionId });
  } catch (e) {
    // Non-fatal: we don't want submission to fail because of video assembly
    console.error('Video assembly failed for session', sessionId, e);
  }

  return {
      sessionId,
    status: finalStatus,
    scorePct,
    ...(highest ? { awardedLevel: highest } : {}), // OMIT when undefined
    proceedNext,              // boolean
  };
}

export async function getSessionStatus(params: { userId: string; sessionId: string }) {
  const { userId, sessionId } = params;
  const session = await ExamSession.findOne({ _id: sessionId, userId }).lean();
  if (!session) throw new AppError('NOT_FOUND', 'Session not found', 404);

  const now = Date.now();
  const leftMs = Math.max(0, new Date(session.deadlineAt).getTime() - now);
  const answered = session.answers.filter((a) => a.selectedIndex !== undefined).length;

  return {
    sessionId: String(session._id),
    status: session.status,
    timeLeftSec: Math.floor(leftMs / 1000),
    answeredCount: answered,
    totalQuestions: session.totalQuestions,
    scorePct: session.scorePct,
    awardedLevel: session.awardedLevel,
  };
}


```

```javascript
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

```

```javascript
// src/services/question.service.ts
import { Types } from 'mongoose';
import type {
  AnyBulkWriteOperation,     // from mongoose (not mongodb)
  UpdateQuery,               // from mongoose
  RootFilterQuery,           // from mongoose
} from 'mongoose';
import { Question, type Level, type QuestionRaw } from '../models/Question';
import { Competency } from '../models/Competency';
import { AppError } from '../utils/error';

type ListOpts = {
  page?: number;
  limit?: number;
  q?: string;
  level?: Level;
  competencyId?: string;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'level' | 'prompt';
  sortOrder?: 'asc' | 'desc';
};

export async function listQuestions(opts: ListOpts) {
  const page = Math.max(opts.page ?? 1, 1);
  const limit = Math.min(opts.limit ?? 10, 100);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (opts.q) filter['$text'] = { $search: opts.q };
  if (opts.level) filter.level = opts.level;
  if (opts.competencyId) filter.competencyId = new Types.ObjectId(opts.competencyId);
  if (opts.isActive !== undefined) filter.isActive = opts.isActive;

  const sort: Record<string, 1 | -1> = {
    [opts.sortBy ?? 'createdAt']: (opts.sortOrder ?? 'desc') === 'asc' ? 1 : -1,
  };

  const [items, total] = await Promise.all([
    Question.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Question.countDocuments(filter),
  ]);

  return { items, meta: { page, limit, total } };
}

export function getQuestion(id: string) {
  return Question.findById(id);
}

export async function createQuestion(data: {
  competencyId: string;
  level: Level;
  prompt: string;
  options: string[];
  correctIndex: number;
  isActive?: boolean;
  meta?: { difficulty?: 'easy' | 'medium' | 'hard'; tags?: string[] };
}) {
  try {
    return await Question.create({
      ...data,
      competencyId: new Types.ObjectId(data.competencyId),
    });
  } catch (e: unknown) {
    // unique index on (competencyId, level)
    console.log(e)
    throw new AppError('CONFLICT', 'Question for this competency and level already exists', 409);
  }
}

export async function updateQuestion(id: string, patch: Partial<Parameters<typeof createQuestion>[0]>) {
  const q = await Question.findByIdAndUpdate(id, patch, { new: true });
  if (!q) throw new AppError('NOT_FOUND', 'Question not found', 404);
  return q;
}

export async function deleteQuestion(id: string) {
  const res = await Question.findByIdAndDelete(id);
  if (!res) throw new AppError('NOT_FOUND', 'Question not found', 404);
  return res;
}

export type ImportRow = {
  competencyCode: string;
  level: Level;
  prompt: string;
  option1: string;
  option2: string;
  option3?: string;
  option4?: string;
  correctIndex: string | number;
  isActive?: string | boolean;
};

export async function importQuestions(rows: ImportRow[], mode: 'upsert' | 'insert') {
  const codes = Array.from(new Set(rows.map((r) => r.competencyCode?.trim()))).filter(
    (c): c is string => !!c,
  );

  const comps = await Competency.find({ code: { $in: codes } }, { _id: 1, code: 1 }).lean();
  const codeToId = new Map(comps.map((c) => [String(c.code), String(c._id)]));

// Use MONGOOSE bulk-write ops, not mongodb's
const ops: AnyBulkWriteOperation<QuestionRaw>[] = [];
const errors: Array<{ row: number; error: string }> = [];

  rows.forEach((r, idx) => {
    const compId = codeToId.get(r.competencyCode);
    if (!compId) {
      errors.push({ row: idx + 1, error: `Unknown competencyCode: ${r.competencyCode}` });
      return;
    }

    const options = [r.option1, r.option2, r.option3, r.option4].filter(
      (s): s is string => !!s && s.trim().length > 0,
    );
    const correctIndex = Number(r.correctIndex);
    if (Number.isNaN(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      errors.push({ row: idx + 1, error: 'Invalid correctIndex for provided options' });
      return;
    }

    const competencyId = new Types.ObjectId(compId);

    // Mongoose filter type
const filter: RootFilterQuery<QuestionRaw> = { competencyId, level: r.level };

    const update: UpdateQuery<QuestionRaw>  = {
      $setOnInsert: { competencyId, level: r.level },
      $set: {
        prompt: r.prompt,
        options,
        correctIndex,
        isActive:
          typeof r.isActive === 'string' ? r.isActive === 'true' : r.isActive ?? true,
        meta: { tags: [r.competencyCode] },
      },
    };

    ops.push(
      mode === 'insert'
        ? {
            insertOne: {
              document: {
                competencyId,
                level: r.level,
                prompt: r.prompt,
                options,
                correctIndex,
                isActive: true,
              },
            },
          }
        : { updateOne: { filter, update, upsert: true } },
    );
  });

  let result = { inserted: 0, upserted: 0, matched: 0 };
  if (ops.length) {
    const res = await Question.bulkWrite(ops, { ordered: false });
    result = {
      inserted: res.insertedCount ?? 0,
      upserted: res.upsertedCount ?? 0,
      matched: res.matchedCount ?? 0,
    };
  }

  return { ...result, errors };
}

```

```javascript
// src/services/scoring.service.ts
import type { Level } from '../models/Question';

/** Map percentage → awarded level for a given step (per spec). */
export function mapScoreToLevel(step: 1|2|3, scorePct: number): { level?: Level; proceedNext?: boolean } {
  const s = scorePct;
  if (step === 1) {
    if (s < 25) return {  proceedNext: false };          // fail + lock
    if (s < 50) return { level: 'A1', proceedNext: false };
    if (s < 75) return { level: 'A2', proceedNext: false };
    return { level: 'A2', proceedNext: true };
  }
  if (step === 2) {
    if (s < 25) return { level: 'A2', proceedNext: false };
    if (s < 50) return { level: 'B1', proceedNext: false };
    if (s < 75) return { level: 'B2', proceedNext: false };
    return { level: 'B2', proceedNext: true };
  }
  // step 3
  if (s < 25) return { level: 'B2', proceedNext: false };
  if (s < 50) return { level: 'C1', proceedNext: false };
  return { level: 'C2', proceedNext: false };
}

/** Compare two levels and return the higher one. */
export function maxLevel(a?: Level, b?: Level): Level | undefined {
  const order: Level[] = ['A1','A2','B1','B2','C1','C2'];
  if (!a) return b;
  if (!b) return a;
  return order.indexOf(a) >= order.indexOf(b) ? a : b;
}

```

```javascript
// src/services/user.service.ts
import { User, type IUser } from '../models/User';

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function createUser(data: Pick<IUser, 'name' | 'email' | 'passwordHash' | 'role'>) {
  const user = await User.create({ ...data, emailVerified: false, status: 'active' });
  return user;
}

export async function markEmailVerified(userId: string) {
  await User.updateOne({ _id: userId }, { $set: { emailVerified: true } });
}

export async function updatePassword(userId: string, passwordHash: string) {
  await User.updateOne({ _id: userId }, { $set: { passwordHash } });
}

```

```javascript
// src/services/video.service.ts
import path from 'node:path';
import fs from 'fs-extra';
import { Types } from 'mongoose';

import { env } from '../config/env';
import { AppError } from '../utils/error';
import { ExamSession } from '../models/ExamSession';
import { RecordingAsset } from '../models/RecordingAsset';

function chunkDir(sessionId: string) {
  return path.join(env.VIDEO_DIR, sessionId);
}
function chunkPath(sessionId: string, index: number) {
  return path.join(chunkDir(sessionId), `chunk_${index}`);
}
function finalPath(sessionId: string, ext = '.webm') {
  return path.join(env.VIDEO_DIR, sessionId, `recording${ext}`);
}

/** Ensure the current user owns the active session. Return session doc. */
export async function mustGetActiveOwnedSession(userId: string, sessionId: string) {
  const s = await ExamSession.findOne({ _id: sessionId, userId, status: 'active' });
  if (!s) throw new AppError('FORBIDDEN', 'Session not found or not active', 403);
  return s;
}

/** Save a raw chunk to disk atomically. */
export async function saveChunk(params: {
  userId: string;
  sessionId: string;
  index: number;
  buffer: Buffer;
  mime?: string; // e.g., video/webm
}) {
  const { userId, sessionId, index, buffer, mime } = params;

  const session = await mustGetActiveOwnedSession(userId, sessionId);

  const dir = chunkDir(sessionId);
  await fs.ensureDir(dir);

  const tmpFile = path.join(dir, `chunk_${index}.tmp`);
  const file = chunkPath(sessionId, index);

  await fs.writeFile(tmpFile, buffer);
  await fs.move(tmpFile, file, { overwrite: true });
console.log('Saved chunk ->', file);

  // Track meta (best-effort; not required for correctness)
  session.videoRecordingMeta = {
    ...(session.videoRecordingMeta ?? {}),
    dir,
    mime: mime ?? session.videoRecordingMeta?.mime,
    chunks: Math.max(session.videoRecordingMeta?.chunks ?? 0, index + 1),
  };
  await session.save();

  return { stored: true, index, bytes: buffer.length };
}

type ChunkEntry = { n: string; i: number };
/**
 * Assemble all chunks into a single file (ordered by index).
 * Makes a best-effort attempt and is safe to call multiple times.
 */
export async function assembleChunks(params: { sessionId: string; expectedExt?: string }) {
  const { sessionId, expectedExt = '.webm' } = params;
  const dir = chunkDir(sessionId);

  const exists = await fs.pathExists(dir);
  if (!exists) return { assembled: false, reason: 'no-chunks' };

  const names = (await fs.readdir(dir)).filter((n: string) => n.startsWith('chunk_'));
  if (names.length === 0) return { assembled: false, reason: 'no-chunks' };

  // Sort by numeric index
  const entries = names
    .map((n: string) => ({ n, i: Number(n.replace('chunk_', '')) }))
    .filter((e : { n: string; i: number }) => Number.isFinite(e.i))
    .sort((a: ChunkEntry, b: ChunkEntry) => a.i - b.i);

  const outPath = finalPath(sessionId, expectedExt);
  const outTmp = `${outPath}.tmp`;

  await fs.ensureFile(outTmp);
  const out = fs.createWriteStream(outTmp);

  for (const e of entries) {
    const p = path.join(dir, e.n);
    await new Promise<void>((resolve, reject) => {
      const rs = fs.createReadStream(p);
      rs.on('error', reject);
      out.on('error', reject);
      rs.on('end', resolve);
      rs.pipe(out, { end: false });
    });
  }

  await new Promise<void>((resolve, reject) => {
    out.on('error', reject);
    out.end(resolve);
  });

  const size = (await fs.stat(outTmp)).size;
  await fs.move(outTmp, outPath, { overwrite: true });

  // Record an asset (upsert by session)
  await RecordingAsset.updateOne(
    { sessionId: new Types.ObjectId(sessionId) },
    {
      $set: {
        kind: 'video',
        storagePath: outPath,
        sizeBytes: size,
        chunks: entries.length,
        completedAt: new Date(),
      },
    },
    { upsert: true },
  );

  // Update session meta (best-effort)
  await ExamSession.updateOne(
    { _id: sessionId },
    {
      $set: {
        'videoRecordingMeta.assembledPath': outPath,
        'videoRecordingMeta.sizeBytes': size,
        'videoRecordingMeta.completedAt': new Date(),
      },
      $setOnInsert: { 'videoRecordingMeta.dir': dir },
    },
  );

  return { assembled: true, path: outPath, sizeBytes: size, chunks: entries.length };
}


```

```javascript
// src/sockets/exam.socket.ts
import type { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import { ExamSession } from '../models/ExamSession';
import type { AccessTokenPayload } from '../utils/jwt';
import { getIO } from '../config/socket';

type Sock = Socket & { data: { user: AccessTokenPayload } };
const roomFor = (id: string) => `session:${id}`;

// Track rooms we should emit timer ticks to
const activeSessionIds = new Set<string>();
let timerStarted = false;

export function registerExamSocketHandlers(io: Server) {
  io.on('connection', (socket: Sock) => {
    const { sub: userId, role } = socket.data.user;

    socket.on('session:join', async (payload: { sessionId: string }, ack?: (ok: boolean, reason?: string) => void) => {
      try {
        const s = await ExamSession.findById(payload.sessionId)
          .select('_id userId status deadlineAt step')
          .lean();

        if (!s) return ack?.(false, 'Not found');

        const isOwner = String(s.userId) === userId;
        const canJoin =
          (role === 'student' && isOwner) ||
          (role === 'supervisor') ||
          (role === 'admin');

        if (!canJoin) return ack?.(false, 'Forbidden');

        const room = roomFor(String(s._id));
        await socket.join(room);
        activeSessionIds.add(String(s._id));
        ack?.(true);

        // Send initial status snapshot
        const timeLeftSec = Math.max(0, Math.floor((new Date(s.deadlineAt).getTime() - Date.now()) / 1000));
        io.to(room).emit('session:timer', { sessionId: String(s._id), timeLeftSec, status: s.status, step: s.step });
      } catch {
        ack?.(false, 'Error');
      }
    });

    socket.on('disconnect', () => {
      // We keep the set relaxed; timer loop checks DB status anyway
    });
  });

  // Start a global 5s ticker once
  if (!timerStarted) {
    timerStarted = true;
    setInterval(async () => {
      if (activeSessionIds.size === 0) return;
      const ids = Array.from(activeSessionIds).map((id) => new Types.ObjectId(id));
      const sessions = await ExamSession.find({ _id: { $in: ids } })
        .select('_id status deadlineAt')
        .lean();

      for (const s of sessions) {
        const timeLeftSec = Math.max(0, Math.floor((new Date(s.deadlineAt).getTime() - Date.now()) / 1000));
        getIO().to(roomFor(String(s._id))).emit('session:timer', {
          sessionId: String(s._id),
          timeLeftSec,
          status: s.status,
        });
      }
    }, 5000);
  }
}

/** Server-side emits for controllers/services */
export function emitSessionStart(sessionId: string, data: { userId: string; step: 1|2|3; deadlineAt: string; totalQuestions: number; }) {
  getIO().to(roomFor(sessionId)).emit('session:start', { sessionId, ...data });
}
export function emitSessionAnswer(sessionId: string, data: { questionId: string; selectedIndex: number; answeredAt: string; }) {
  getIO().to(roomFor(sessionId)).emit('session:answer', { sessionId, ...data });
}
export function emitSessionViolation(sessionId: string, data: { type: string; occurredAt: string }) {
  getIO().to(roomFor(sessionId)).emit('session:violation', { sessionId, ...data });
}
export function emitSessionSubmit(sessionId: string, data: { status: string; scorePct: number; awardedLevel?: string; proceedNext?: boolean; }) {
  getIO().to(roomFor(sessionId)).emit('session:submit', { sessionId, ...data });
}

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
// src/types/user.types.ts
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'supervisor';
  emailVerified: boolean;
  status: 'active' | 'inactive';
  isLockedFromStep1?: boolean;
  createdAt: Date;
  updatedAt: Date;
  password?: string; // never expose
  // add any other internal fields here if needed
}

export interface IPublicUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'supervisor';
  emailVerified: boolean;
  status: 'active' | 'inactive' ;
  isLockedFromStep1: boolean;
  createdAt: Date;
  updatedAt: Date;
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
import { Readable } from 'node:stream';
import { parse, type RowMap } from '@fast-csv/parse';
import { format } from '@fast-csv/format';
import type { Response } from 'express';

export async function parseCsvBuffer<T = Record<string, string>>(buffer: Buffer): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    const rows: T[] = [];
    Readable.from(buffer)
      .pipe(
        parse<RowMap<string>, RowMap<string>>({
          headers: true,
          ignoreEmpty: true,
          trim: true,
        }),
      )
      .on('error', reject)
      .on('data', (row: T) => rows.push(row))
      .on('end', () => resolve(rows));
  });
}

export async function sendCsv(
  res: Response,
  filename: string,
  rows: AsyncIterable<Record<string, unknown>> | Array<Record<string, unknown>>,
) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const csv = format({ headers: true });
  csv.pipe(res);

  if (Symbol.asyncIterator in rows) {
    for await (const row of rows as AsyncIterable<Record<string, unknown>>) {
      csv.write(row);
    }
  } else {
    for (const row of rows as Array<Record<string, unknown>>) {
      csv.write(row);
    }
  }

  csv.end();
}

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
import fs from 'fs-extra';
import path from 'node:path';
import PDFDocument from 'pdfkit';

export type CertPdfInput = {
  outPath: string;
  name: string;
  email: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  issuedAt: Date;
  certificateId: string;
};

export async function generateCertificatePDF(input: CertPdfInput) {
  await fs.ensureDir(path.dirname(input.outPath));

  const doc = new PDFDocument({ size: 'A4', margins: { top: 72, right: 72, bottom: 72, left: 72 }});
  const tmp = `${input.outPath}.tmp`;
  const stream = fs.createWriteStream(tmp);
  doc.pipe(stream);

  // Header
  doc.fontSize(22).text('Test_School – Certificate of Digital Competency', { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(14).fillColor('#555').text('This certifies that', { align: 'center' });
  doc.moveDown(0.5);

  // Name
  doc.fontSize(28).fillColor('#000').text(input.name, { align: 'center' });
  doc.moveDown(0.25);
  doc.fontSize(12).fillColor('#333').text(input.email, { align: 'center' });

  doc.moveDown(1.5);
  doc.fontSize(16).fillColor('#000').text('has achieved the level', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(40).text(input.level, { align: 'center' });

  doc.moveDown(1.5);
  doc.fontSize(12).fillColor('#333')
    .text(`Issued on: ${input.issuedAt.toISOString().slice(0, 10)}`, { align: 'center' });
  doc.text(`Certificate ID: ${input.certificateId}`, { align: 'center' });

  doc.moveDown(2);
  doc.fontSize(10).fillColor('#777')
    .text('Verification: Provide this Certificate ID to verify via the public endpoint.', { align: 'center' });

  // Signature line (simple)
  doc.moveDown(3);
  doc.fontSize(12).fillColor('#000').text('__________________________', { align: 'center' });
  doc.fontSize(10).fillColor('#555').text('Authorized Signatory', { align: 'center' });

  doc.end();

  await new Promise<void>((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
  await fs.move(tmp, input.outPath, { overwrite: true });
  return { path: input.outPath };
}

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
// validators/admin.sessions.validators.ts
import { z } from 'zod';

export const ListSessionsQuery = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().trim().optional(),
    status: z.enum(['pending', 'active', 'submitted', 'cancelled']).optional(),
    step: z.coerce.number().int().min(1).max(3).optional(),
    userId: z.string().optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  }),
};

export const SessionIdParams = {
  params: z.object({ id: z.string().min(1) }),
};

// ✅ export TS types for safe casting in controllers
export type ListSessionsQueryType = z.infer<typeof ListSessionsQuery.query>;
export type SessionIdParamsType = z.infer<typeof SessionIdParams.params>;

```

```javascript
// validators/auth.validators.ts
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

export const RefreshSchema = z.object({
  // empty body; refresh token comes from cookie or Authorization header
});

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
```

```javascript
// validators/competency.validators.ts
import { z } from 'zod';

export const CompetencyIdParams = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id'),
});

export const CreateCompetencySchema = z.object({
  code: z.string().min(3).max(50),
  name: z.string().min(2).max(150),
  description: z.string().max(1000).optional(),
});

export const UpdateCompetencySchema = z.object({
  code: z.string().min(3).max(50).optional(),
  name: z.string().min(2).max(150).optional(),
  description: z.string().max(1000).optional(),
});

export const ListCompetencyQuery = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  q: z.string().optional(),
  sortBy: z.enum(['name', 'code', 'createdAt']).default('createdAt').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});
```

```javascript
// validators/certification.validators.ts
import { z } from 'zod';

export const ObjectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const CertIdParams = z.object({ id: ObjectId });
export const VerifyPublicIdParams = z.object({
  certificateId: z.string().min(10).max(100),
});
```

```javascript
// validators/exam.validators.ts
import { z } from 'zod';

export const ObjectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const StartExamQuery = z.object({
  step: z.coerce.number().int().min(1).max(3),
});
export const StartExamBody = z.object({
  screen: z
    .object({ width: z.number().int().positive(), height: z.number().int().positive() })
    .optional(),
});

export const AnswerBody = z.object({
  sessionId: ObjectId,
  questionId: ObjectId,
  selectedIndex: z.number().int().min(0),
  elapsedMs: z.number().int().min(0).optional(),
});

export const SubmitBody = z.object({
  sessionId: ObjectId,
});

export const ViolationBody = z.object({
  sessionId: ObjectId,
  type: z.enum(['TAB_BLUR', 'FULLSCREEN_EXIT', 'COPY', 'PASTE', 'RIGHT_CLICK']),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const SessionIdParams = z.object({
  sessionId: ObjectId,
});

export const UploadChunkQuery = z.object({
  sessionId: ObjectId,
  index: z.coerce.number().int().min(0),
});
```

```javascript
// auth/validators/question.validator.ts
import { z } from 'zod';

export const LevelEnum = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);

export const QuestionIdParams = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id'),
});

export const CreateQuestionSchema = z
  .object({
    competencyId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid competencyId'),
    level: LevelEnum,
    prompt: z.string().min(10).max(1000),
    options: z.array(z.string().min(1)).min(2).max(10),
    correctIndex: z.number().int().nonnegative(),
    isActive: z.boolean().optional(),
    meta: z
      .object({
        difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
        tags: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .refine((v) => v.correctIndex < v.options.length, {
    message: 'correctIndex must reference an item in options',
    path: ['correctIndex'],
  });

export const UpdateQuestionSchema = CreateQuestionSchema.partial().refine(
  (v) => {
    if (!v.options || v.correctIndex === undefined) return true;
    return v.correctIndex < v.options.length;
  },
  { message: 'correctIndex must reference an item in options', path: ['correctIndex'] },
);

export const ListQuestionQuery = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  q: z.string().optional(),
  level: LevelEnum.optional(),
  competencyId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(['createdAt', 'level', 'prompt']).default('createdAt').optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});

export const ImportQuery = z.object({
  mode: z.enum(['upsert', 'insert']).default('upsert').optional(),
});
```

```javascript
// validators/systemConfig.validators.ts
import { z } from 'zod';

export const PatchSystemConfigSchema = {
  body: z
    .object({
      timePerQuestionSec: z.number().int().min(30).max(300).optional(),
      retakeLockMinutes: z
        .number()
        .int()
        .min(0)
        .max(24 * 60)
        .optional(),
      maxRetakes: z.number().int().min(0).max(10).optional(),
      sebMode: z.enum(['off', 'warn', 'enforce']).optional(),
    })
    .refine((v) => Object.keys(v).length > 0, { message: 'Provide at least one field to update.' }),
};

export const GetSystemConfigQuery = {}; // nothing for now
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
