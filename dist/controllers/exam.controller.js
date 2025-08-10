import { asyncHandler } from '../utils/asyncHandler';
import { sendOk, sendCreated } from '../utils/respond';
import { startExam, answerQuestion, submitExam, getSessionStatus, recordViolation, getLatestResultForUser, } from '../services/exam.service';
import { emitSessionStart, emitSessionAnswer, emitSessionViolation, emitSessionSubmit, } from '../sockets/exam.socket';
export const startCtrl = asyncHandler(async (req, res) => {
    const userId = req.user.sub;
    const step = Number(req.query.step);
    const client = {
        ...(req.ip ? { ip: req.ip } : {}),
        ...(req.get('user-agent') ? { userAgent: req.get('user-agent') } : {}),
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
export const answerCtrl = asyncHandler(async (req, res) => {
    const userId = req.user.sub;
    const { sessionId, questionId, selectedIndex, elapsedMs } = req.body;
    const payload = {
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
export const submitCtrl = asyncHandler(async (req, res) => {
    const userId = req.user.sub;
    const { sessionId } = req.body;
    const out = await submitExam({ userId, sessionId, reason: 'user' });
    emitSessionSubmit(req.body.sessionId, {
        status: out.status,
        scorePct: out.scorePct,
        ...(out.awardedLevel ? { awardedLevel: out.awardedLevel } : {}),
        proceedNext: out.proceedNext,
    });
    return sendOk(res, out, 'Exam submitted');
});
export const statusCtrl = asyncHandler(async (req, res) => {
    const userId = req.user.sub;
    const { sessionId } = req.params;
    const out = await getSessionStatus({ userId, sessionId });
    return sendOk(res, out, 'Status');
});
export const violationCtrl = asyncHandler(async (req, res) => {
    const userId = req.user.sub;
    const { sessionId, type, meta } = req.body;
    const out = await recordViolation({
        userId,
        sessionId,
        type,
        ...(meta ? { meta } : {}),
    });
    emitSessionViolation(sessionId, { type, occurredAt: new Date().toISOString() });
    return sendOk(res, out, 'Violation recorded');
});
export const latestResultCtrl = asyncHandler(async (req, res) => {
    const userId = req.user.sub;
    const out = await getLatestResultForUser({ userId });
    // Return null when nothing found (consistent with cert API style)
    return sendOk(res, { latest: out }, 'Latest exam result');
});
