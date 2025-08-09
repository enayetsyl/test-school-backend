import { Types } from 'mongoose';
import { AuditLog } from '../models/AuditLog';
export async function logAudit(actorId, action, target, meta) {
    await AuditLog.create({
        actorId: new Types.ObjectId(actorId),
        action,
        target,
        meta,
    });
}
