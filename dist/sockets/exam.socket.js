"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerExamSocketHandlers = registerExamSocketHandlers;
exports.emitSessionStart = emitSessionStart;
exports.emitSessionAnswer = emitSessionAnswer;
exports.emitSessionViolation = emitSessionViolation;
exports.emitSessionSubmit = emitSessionSubmit;
const mongoose_1 = require("mongoose");
const ExamSession_1 = require("../models/ExamSession");
const socket_1 = require("../config/socket");
const roomFor = (id) => `session:${id}`;
// Track rooms we should emit timer ticks to
const activeSessionIds = new Set();
let timerStarted = false;
function registerExamSocketHandlers(io) {
    io.on('connection', (socket) => {
        const { sub: userId, role } = socket.data.user;
        socket.on('session:join', async (payload, ack) => {
            try {
                const s = await ExamSession_1.ExamSession.findById(payload.sessionId)
                    .select('_id userId status deadlineAt step')
                    .lean();
                if (!s)
                    return ack?.(false, 'Not found');
                const isOwner = String(s.userId) === userId;
                const canJoin = (role === 'student' && isOwner) || role === 'supervisor' || role === 'admin';
                if (!canJoin)
                    return ack?.(false, 'Forbidden');
                const room = roomFor(String(s._id));
                await socket.join(room);
                activeSessionIds.add(String(s._id));
                ack?.(true);
                // Send initial status snapshot
                const timeLeftSec = Math.max(0, Math.floor((new Date(s.deadlineAt).getTime() - Date.now()) / 1000));
                io.to(room).emit('session:timer', {
                    sessionId: String(s._id),
                    timeLeftSec,
                    status: s.status,
                    step: s.step,
                });
            }
            catch {
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
            if (activeSessionIds.size === 0)
                return;
            const ids = Array.from(activeSessionIds).map((id) => new mongoose_1.Types.ObjectId(id));
            const sessions = await ExamSession_1.ExamSession.find({ _id: { $in: ids } })
                .select('_id status deadlineAt')
                .lean();
            for (const s of sessions) {
                const timeLeftSec = Math.max(0, Math.floor((new Date(s.deadlineAt).getTime() - Date.now()) / 1000));
                (0, socket_1.getIO)()
                    .to(roomFor(String(s._id)))
                    .emit('session:timer', {
                    sessionId: String(s._id),
                    timeLeftSec,
                    status: s.status,
                });
            }
        }, 5000);
    }
}
/** Server-side emits for controllers/services */
function emitSessionStart(sessionId, data) {
    (0, socket_1.getIO)()
        .to(roomFor(sessionId))
        .emit('session:start', { sessionId, ...data });
}
function emitSessionAnswer(sessionId, data) {
    (0, socket_1.getIO)()
        .to(roomFor(sessionId))
        .emit('session:answer', { sessionId, ...data });
}
function emitSessionViolation(sessionId, data) {
    (0, socket_1.getIO)()
        .to(roomFor(sessionId))
        .emit('session:violation', { sessionId, ...data });
}
function emitSessionSubmit(sessionId, data) {
    (0, socket_1.getIO)()
        .to(roomFor(sessionId))
        .emit('session:submit', { sessionId, ...data });
}
