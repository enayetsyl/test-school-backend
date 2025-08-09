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

    socket.on(
      'session:join',
      async (payload: { sessionId: string }, ack?: (ok: boolean, reason?: string) => void) => {
        try {
          const s = await ExamSession.findById(payload.sessionId)
            .select('_id userId status deadlineAt step')
            .lean();

          if (!s) return ack?.(false, 'Not found');

          const isOwner = String(s.userId) === userId;
          const canJoin =
            (role === 'student' && isOwner) || role === 'supervisor' || role === 'admin';

          if (!canJoin) return ack?.(false, 'Forbidden');

          const room = roomFor(String(s._id));
          await socket.join(room);
          activeSessionIds.add(String(s._id));
          ack?.(true);

          // Send initial status snapshot
          const timeLeftSec = Math.max(
            0,
            Math.floor((new Date(s.deadlineAt).getTime() - Date.now()) / 1000),
          );
          io.to(room).emit('session:timer', {
            sessionId: String(s._id),
            timeLeftSec,
            status: s.status,
            step: s.step,
          });
        } catch {
          ack?.(false, 'Error');
        }
      },
    );

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
        const timeLeftSec = Math.max(
          0,
          Math.floor((new Date(s.deadlineAt).getTime() - Date.now()) / 1000),
        );
        getIO()
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
export function emitSessionStart(
  sessionId: string,
  data: { userId: string; step: 1 | 2 | 3; deadlineAt: string; totalQuestions: number },
) {
  getIO()
    .to(roomFor(sessionId))
    .emit('session:start', { sessionId, ...data });
}
export function emitSessionAnswer(
  sessionId: string,
  data: { questionId: string; selectedIndex: number; answeredAt: string },
) {
  getIO()
    .to(roomFor(sessionId))
    .emit('session:answer', { sessionId, ...data });
}
export function emitSessionViolation(
  sessionId: string,
  data: { type: string; occurredAt: string },
) {
  getIO()
    .to(roomFor(sessionId))
    .emit('session:violation', { sessionId, ...data });
}
export function emitSessionSubmit(
  sessionId: string,
  data: { status: string; scorePct: number; awardedLevel?: string; proceedNext?: boolean },
) {
  getIO()
    .to(roomFor(sessionId))
    .emit('session:submit', { sessionId, ...data });
}
