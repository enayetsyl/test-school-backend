import { asyncHandler } from '../utils/asyncHandler';
import { sendOk, sendCreated } from '../utils/respond';
import { startExam, answerQuestion, submitExam, getSessionStatus, recordViolation, } from '../services/exam.service';
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
    return sendOk(res, out, 'Answer saved');
});
export const submitCtrl = asyncHandler(async (req, res) => {
    const userId = req.user.sub;
    const { sessionId } = req.body;
    const out = await submitExam({ userId, sessionId, reason: 'user' });
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
    return sendOk(res, out, 'Violation recorded');
});
