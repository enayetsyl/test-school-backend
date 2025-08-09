// src/controllers/admin.audio.controller.ts
import type { Request, Response } from 'express';
import mongoose, { Types, type FilterQuery } from 'mongoose';
import { type ListAuditQueryInput } from '../validators/admin.audit.validators';
import { type AuditLogDoc } from '../models/AuditLog';

// Prefer importing your model if exported:
//   import { AuditLog } from '../models/auditLog.model';
const AuditLog = mongoose.model('AuditLog');

export async function listAuditLogsCtrl(req: Request, res: Response) {
  const { page, limit, actorId, action, resource, from, to, q } =
    req.query as unknown as ListAuditQueryInput;

  const filter: FilterQuery<AuditLogDoc> = {};
  if (actorId) filter.actor = new Types.ObjectId(actorId);

  if (actorId) filter.actor = actorId;
  if (action) filter.action = action;
  if (resource) filter.resource = resource;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = from;
    if (to) filter.createdAt.$lte = to;
  }
  if (q?.trim()) {
    const t = q.trim();
    filter.$or = [
      { message: { $regex: t, $options: 'i' } },
      { 'meta.note': { $regex: t, $options: 'i' } },
    ];
  }

  const pageNum = Number(page) || 1;
  const lim = Number(limit) || 20;
  const skip = (pageNum - 1) * lim;

  const [items, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim)
      .populate({ path: 'actor', select: 'name email role' })
      .select('_id action resource resourceId message meta createdAt actor')
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    meta: { page: pageNum, limit: lim, total, pageCount: Math.ceil(total / lim) },
    data: items,
  });
}
