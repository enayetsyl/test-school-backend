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
import {
  emitSessionStart,
  emitSessionAnswer,
  emitSessionViolation,
  emitSessionSubmit,
} from '../sockets/exam.socket';

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
