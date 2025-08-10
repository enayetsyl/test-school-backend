"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureEligibility = ensureEligibility;
exports.startExam = startExam;
exports.answerQuestion = answerQuestion;
exports.recordViolation = recordViolation;
exports.submitExam = submitExam;
exports.getSessionStatus = getSessionStatus;
exports.getLatestResultForUser = getLatestResultForUser;
// src/services/exam.service.ts
const node_crypto_1 = __importDefault(require("node:crypto"));
const mongoose_1 = require("mongoose");
const env_1 = require("../config/env");
const error_1 = require("../utils/error");
const Question_1 = require("../models/Question");
const ExamSession_1 = require("../models/ExamSession");
const User_1 = require("../models/User");
const scoring_service_1 = require("./scoring.service");
const video_service_1 = require("./video.service");
const certification_service_1 = require("./certification.service");
function levelsForStep(step) {
    if (step === 1)
        return ['A1', 'A2'];
    if (step === 2)
        return ['B1', 'B2'];
    return ['C1', 'C2'];
}
async function ensureEligibility(userId, step) {
    const user = await User_1.User.findById(userId).lean();
    if (!user)
        throw new error_1.AppError('UNAUTHORIZED', 'User not found', 401);
    if (step === 1) {
        if (user.isLockedFromStep1)
            throw new error_1.AppError('FORBIDDEN', 'Locked from retaking Step 1', 403);
        return;
    }
    // Steps 2 & 3 require >=75% in previous step
    const prevStep = (step - 1);
    const prev = await ExamSession_1.ExamSession.findOne({
        userId,
        step: prevStep,
        status: { $in: ['submitted', 'expired'] },
    })
        .sort({ createdAt: -1 })
        .lean();
    if (!prev || (prev.scorePct ?? 0) < 75) {
        throw new error_1.AppError('FORBIDDEN', `Not eligible for Step ${step}`, 403);
    }
}
async function startExam(params) {
    const { userId, step, client } = params;
    await ensureEligibility(userId, step);
    const [l1, l2] = levelsForStep(step);
    const questions = await Question_1.Question.find({ level: { $in: [l1, l2] }, isActive: true })
        .select('_id competencyId level')
        .lean();
    if (questions.length !== 44) {
        // per spec: 22 competencies × 2 levels = 44
        throw new error_1.AppError('CONFLICT', `Expected 44 questions for step ${step}, found ${questions.length}`, 409);
    }
    // Shuffle to randomize order, but stable enough
    const shuffled = [...questions].sort(() => (node_crypto_1.default.randomInt(0, 2) ? 1 : -1));
    const timePerQuestionSec = env_1.env.TIME_PER_QUESTION_SECONDS;
    const totalQuestions = shuffled.length;
    const startAt = new Date();
    const deadlineAt = new Date(startAt.getTime() + totalQuestions * timePerQuestionSec * 1000);
    const session = await ExamSession_1.ExamSession.create({
        userId: new mongoose_1.Types.ObjectId(userId),
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
async function answerQuestion(params) {
    const { userId, sessionId, questionId, selectedIndex, elapsedMs } = params;
    const session = await ExamSession_1.ExamSession.findOne({ _id: sessionId, userId });
    if (!session)
        throw new error_1.AppError('NOT_FOUND', 'Session not found', 404);
    if (session.status !== 'active')
        throw new error_1.AppError('FORBIDDEN', 'Session not active', 403);
    const now = new Date();
    if (now > session.deadlineAt) {
        session.status = 'expired';
        session.endAt = now;
        await session.save();
        throw new error_1.AppError('FORBIDDEN', 'Session time elapsed', 403);
    }
    // Validate index against actual question options length
    const q = await Question_1.Question.findById(questionId).select('options').lean();
    if (!q)
        throw new error_1.AppError('NOT_FOUND', 'Question not found', 404);
    if (selectedIndex < 0 || selectedIndex >= (q.options?.length ?? 0)) {
        throw new error_1.AppError('VALIDATION_ERROR', 'selectedIndex out of bounds', 400);
    }
    const ans = session.answers.find((a) => String(a.questionId) === String(questionId));
    if (!ans)
        throw new error_1.AppError('VALIDATION_ERROR', 'Question not in session', 400);
    ans.selectedIndex = selectedIndex;
    ans.answeredAt = now;
    if (typeof elapsedMs === 'number')
        ans.elapsedMs = elapsedMs;
    await session.save();
    return { saved: true };
}
async function recordViolation(params) {
    const { userId, sessionId, type, meta } = params;
    const session = await ExamSession_1.ExamSession.findOne({ _id: sessionId, userId });
    if (!session)
        throw new error_1.AppError('NOT_FOUND', 'Session not found', 404);
    if (session.status !== 'active')
        return { saved: false };
    const v = { type, occurredAt: new Date() };
    if (meta !== undefined)
        v.meta = meta; // only set when present
    session.violations.push(v);
    await session.save();
    return { saved: true, violations: session.violations.length };
}
async function submitExam(params) {
    const { userId, sessionId } = params;
    const session = await ExamSession_1.ExamSession.findOne({ _id: sessionId, userId });
    if (!session)
        throw new error_1.AppError('NOT_FOUND', 'Session not found', 404);
    if (session.status !== 'active') {
        const allowed = ['submitted', 'expired', 'abandoned'];
        const st = session.status;
        const safeStatus = allowed.includes(st)
            ? st
            : 'submitted';
        return {
            sessionId,
            status: safeStatus,
            scorePct: session.scorePct ?? 0,
            proceedNext: false,
            ...(session.awardedLevel ? { awardedLevel: session.awardedLevel } : {}),
            already: true,
        };
    }
    const now = new Date();
    const expired = now > session.deadlineAt;
    // Compute and persist the final status
    const finalStatus = expired ? 'expired' : 'submitted';
    session.status = finalStatus;
    session.endAt = now;
    // Score
    const ids = session.questions.map((q) => q.questionId);
    const bank = await Question_1.Question.find({ _id: { $in: ids } }, { _id: 1, correctIndex: 1 }).lean();
    const correctById = new Map(bank.map((b) => [String(b._id), b.correctIndex]));
    let correct = 0;
    for (const a of session.answers) {
        const ci = correctById.get(String(a.questionId));
        if (ci !== undefined && a.selectedIndex !== undefined) {
            a.isCorrect = a.selectedIndex === ci;
            if (a.isCorrect)
                correct += 1;
        }
        else {
            a.isCorrect = false;
        }
    }
    const scorePct = Math.round((correct / session.totalQuestions) * 10000) / 100; // 2 decimals
    session.scorePct = scorePct;
    const mapped = (0, scoring_service_1.mapScoreToLevel)(session.step, scorePct);
    const level = mapped.level;
    const proceedNext = !!mapped.proceedNext;
    if (level)
        session.awardedLevel = level;
    // Step 1 <25% locks retake
    if (session.step === 1 && scorePct < 25) {
        await User_1.User.updateOne({ _id: userId }, { $set: { isLockedFromStep1: true } });
    }
    await session.save();
    const prior = await ExamSession_1.ExamSession.find({
        userId,
        status: { $in: ['submitted', 'expired', 'auto-submitted', 'closed'] },
    })
        .select('awardedLevel')
        .lean();
    let highest = undefined;
    for (const s of prior) {
        highest = (0, scoring_service_1.maxLevel)(highest, s.awardedLevel);
    }
    highest = (0, scoring_service_1.maxLevel)(highest, session.awardedLevel);
    if (highest) {
        try {
            await (0, certification_service_1.updateHighestCertificate)(userId, highest);
        }
        catch (e) {
            // Non-fatal: scoring should not fail if certificate generation hiccups
            console.error('Certificate update failed for user', userId, e);
        }
    }
    try {
        await (0, video_service_1.assembleChunks)({ sessionId });
    }
    catch (e) {
        // Non-fatal: we don't want submission to fail because of video assembly
        console.error('Video assembly failed for session', sessionId, e);
    }
    return {
        sessionId,
        status: finalStatus,
        scorePct,
        ...(highest ? { awardedLevel: highest } : {}), // OMIT when undefined
        proceedNext, // boolean
    };
}
async function getSessionStatus(params) {
    const { userId, sessionId } = params;
    const session = await ExamSession_1.ExamSession.findOne({ _id: sessionId, userId }).lean();
    if (!session)
        throw new error_1.AppError('NOT_FOUND', 'Session not found', 404);
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
async function getLatestResultForUser(params) {
    const { userId } = params;
    // Find the most recent non-active session
    const session = await ExamSession_1.ExamSession.findOne({
        userId,
        status: { $in: ['submitted', 'expired', 'abandoned'] },
    })
        .sort({ endAt: -1, updatedAt: -1, createdAt: -1 })
        .lean();
    if (!session)
        return null;
    // Compute proceedNext consistently with submitExam
    let proceedNext = false;
    if ((session.status === 'submitted' || session.status === 'expired') &&
        typeof session.scorePct === 'number') {
        const mapped = (0, scoring_service_1.mapScoreToLevel)(session.step, session.scorePct);
        proceedNext = !!mapped.proceedNext;
    }
    const submittedAt = (session.endAt ?? session.updatedAt ?? session.createdAt).toISOString?.() ??
        String(session.endAt ?? session.updatedAt ?? session.createdAt);
    const out = {
        sessionId: String(session._id),
        step: session.step,
        status: session.status,
        ...(typeof session.scorePct === 'number' ? { scorePct: session.scorePct } : {}),
        ...(session.awardedLevel ? { awardedLevel: session.awardedLevel } : {}),
        proceedNext,
        submittedAt,
    };
    return out;
}
