// src/controllers/admin.audio.controller.ts
import type { Request, Response } from 'express';
import { Types, type FilterQuery } from 'mongoose';
import { type ListAuditQueryInput } from '../validators/admin.audit.validators';
import { type AuditLogDoc } from '../models/AuditLog';

// Prefer importing your model if exported:
import { AuditLog } from '../models/AuditLog';
// const AuditLog = mongoose.model('AuditLog');

export async function listAuditLogsCtrl(req: Request, res: Response) {
  const { page, limit, actorId, action, resource, from, to, q } =
    req.query as unknown as ListAuditQueryInput;

  const filter: FilterQuery<AuditLogDoc> = {};
  if (actorId) filter.actorId = new Types.ObjectId(actorId);
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

  const [rows, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim)
      .select('_id action target message meta createdAt actorId')
      .populate({ path: 'actorId', select: 'name email role' })
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = rows.map((r: any) => ({
    _id: r._id,
    action: r.action,
    resource: r?.target?.type ?? null,
    resourceId: r?.target?.id ?? null,
    message:
      typeof r?.meta?.message === 'string'
        ? r.meta.message
        : typeof r?.meta?.note === 'string'
          ? r.meta.note
          : undefined,
    createdAt: r.createdAt,
    // expose as `actor` for the frontend
    actor:
      r.actorId && typeof r.actorId === 'object'
        ? {
            id: String(r.actorId._id),
            name: r.actorId.name,
            email: r.actorId.email,
            role: r.actorId.role,
          }
        : null,
  }));

  return res.json({
    success: true,
    meta: { page: pageNum, limit: lim, total, pageCount: Math.ceil(total / lim) },
    data: items,
  });
}
