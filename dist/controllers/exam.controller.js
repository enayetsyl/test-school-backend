"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.latestResultCtrl = exports.violationCtrl = exports.statusCtrl = exports.submitCtrl = exports.answerCtrl = exports.startCtrl = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const respond_1 = require("../utils/respond");
const exam_service_1 = require("../services/exam.service");
const exam_socket_1 = require("../sockets/exam.socket");
exports.startCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
    const out = await (0, exam_service_1.startExam)({ userId, step, client });
    (0, exam_socket_1.emitSessionStart)(out.sessionId, {
        userId,
        step,
        deadlineAt: out.deadlineAt.toISOString?.() ?? String(out.deadlineAt),
        totalQuestions: out.totalQuestions,
    });
    return (0, respond_1.sendCreated)(res, out, 'Exam started');
});
exports.answerCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.sub;
    const { sessionId, questionId, selectedIndex, elapsedMs } = req.body;
    const payload = {
        userId,
        sessionId,
        questionId,
        selectedIndex,
        ...(elapsedMs !== undefined ? { elapsedMs } : {}),
    };
    const out = await (0, exam_service_1.answerQuestion)(payload);
    const answeredAt = new Date().toISOString();
    (0, exam_socket_1.emitSessionAnswer)(req.body.sessionId, {
        questionId: req.body.questionId,
        selectedIndex: req.body.selectedIndex,
        answeredAt,
    });
    return (0, respond_1.sendOk)(res, out, 'Answer saved');
});
exports.submitCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.sub;
    const { sessionId } = req.body;
    const out = await (0, exam_service_1.submitExam)({ userId, sessionId, reason: 'user' });
    (0, exam_socket_1.emitSessionSubmit)(req.body.sessionId, {
        status: out.status,
        scorePct: out.scorePct,
        ...(out.awardedLevel ? { awardedLevel: out.awardedLevel } : {}),
        proceedNext: out.proceedNext,
    });
    return (0, respond_1.sendOk)(res, out, 'Exam submitted');
});
exports.statusCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.sub;
    const { sessionId } = req.params;
    const out = await (0, exam_service_1.getSessionStatus)({ userId, sessionId });
    return (0, respond_1.sendOk)(res, out, 'Status');
});
exports.violationCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.sub;
    const { sessionId, type, meta } = req.body;
    const out = await (0, exam_service_1.recordViolation)({
        userId,
        sessionId,
        type,
        ...(meta ? { meta } : {}),
    });
    (0, exam_socket_1.emitSessionViolation)(sessionId, { type, occurredAt: new Date().toISOString() });
    return (0, respond_1.sendOk)(res, out, 'Violation recorded');
});
exports.latestResultCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.sub;
    const out = await (0, exam_service_1.getLatestResultForUser)({ userId });
    // Return null when nothing found (consistent with cert API style)
    return (0, respond_1.sendOk)(res, { latest: out }, 'Latest exam result');
});
