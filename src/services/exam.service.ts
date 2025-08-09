// src/services/exam.service.ts
import crypto from 'node:crypto';
import { Types } from 'mongoose';
import { env } from '../config/env';
import { AppError } from '../utils/error';
import { type Level, Question } from '../models/Question';
import { ExamSession, type IViolationEvent } from '../models/ExamSession';
import { User } from '../models/User';
import { Certification } from '../models/Certification';
import { mapScoreToLevel, maxLevel } from './scoring.service';
import { assembleChunks } from './video.service';

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
}) {
  const { userId, sessionId } = params;
  const session = await ExamSession.findOne({ _id: sessionId, userId });
  if (!session) throw new AppError('NOT_FOUND', 'Session not found', 404);
  if (session.status !== 'active') {
    return { already: true, sessionId };
  }

  const now = new Date();
  const expired = now > session.deadlineAt;
  session.status = expired ? 'expired' : 'submitted';
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

  const { level, proceedNext } = mapScoreToLevel(session.step, scorePct); // per spec thresholds
  if (level) session.awardedLevel = level;

  // Step 1 <25% locks retake
  if (session.step === 1 && scorePct < 25) {
    await User.updateOne({ _id: userId }, { $set: { isLockedFromStep1: true } });
  }

  await session.save();

  type AwardedOnly = { awardedLevel?: Level };

  const prior: AwardedOnly[] = await ExamSession.find({
    userId,
    status: { $in: ['submitted', 'expired'] },
  })
    .select('awardedLevel')
    .lean();

  let highest: Level | undefined = undefined;
  for (const s of prior) {
    highest = maxLevel(highest, s.awardedLevel);
  }
  highest = maxLevel(highest, session.awardedLevel);

  if (highest) {
    const certificateId = crypto.randomUUID();
    await Certification.updateOne(
      { userId },
      { $set: { highestLevel: highest, issuedAt: new Date(), certificateId } },
      { upsert: true },
    );
  }

  try {
    await assembleChunks({ sessionId });
  } catch (e) {
    // Non-fatal: we don't want submission to fail because of video assembly
    console.error('Video assembly failed for session', sessionId, e);
  }

  return {
    sessionId,
    status: session.status,
    scorePct,
    awardedLevel: session.awardedLevel,
    proceedNext: !!proceedNext,
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
