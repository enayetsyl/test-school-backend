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
  _id: mongoose.Types.ObjectId | string;
  userId?: UserLite;
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

  // ---- Coerce query params
  const pageNum = Number(page) > 0 ? Number(page) : 1;
  const lim = Number(limit) > 0 ? Number(limit) : 20;
  const stepNum = step !== undefined ? Number(step) : undefined;

  const filter: SessionFilter = {};
  if (status) filter.status = status;
  if (stepNum !== undefined && isStep(stepNum)) filter.step = stepNum;
  if (userId) filter.user = new mongoose.Types.ObjectId(userId);
  if (from || to) {
    const range: DateRange = {};
    if (from) range.$gte = from;
    if (to) range.$lte = to;
    filter.startedAt = range;
  }

  const skip = (pageNum - 1) * lim;

  const query = ExamSession.find(filter)
    .sort({ startedAt: -1 })
    .skip(skip)
    .limit(lim)
    .select('_id user step status score startedAt submittedAt violationsCount videoRecordingMeta')
    .populate({ path: 'userId', select: 'name email role', model: 'User' });

  const [items, total] = await Promise.all([
    query.lean<SessionListItem[]>(),
    ExamSession.countDocuments(filter),
  ]);

  // ---- Text search on _id, userId.name, userId.email
  const needle = (q ?? '').toLowerCase().trim();
  const data: SessionListItem[] =
    needle.length > 0
      ? items.filter((it) => {
          const idStr = String(it._id ?? '').toLowerCase();
          const name = (it.userId?.name ?? '').toLowerCase();
          const email = (it.userId?.email ?? '').toLowerCase();
          return idStr.includes(needle) || name.includes(needle) || email.includes(needle);
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
