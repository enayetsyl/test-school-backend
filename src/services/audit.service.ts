import { Types } from 'mongoose';
import { AuditLog } from '../models/AuditLog';

export async function logAudit(
  actorId: string,
  action: string,
  target?: { type: string; id: string },
  meta?: Record<string, unknown>,
) {
  await AuditLog.create({
    actorId: new Types.ObjectId(actorId),
    action,
    target,
    meta,
  });
}
