// src/models/AuditLog.ts
import { Schema, model } from 'mongoose';
const AuditLogSchema = new Schema({
    actorId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    action: { type: String, required: true, index: true },
    target: {
        type: { type: String },
        id: { type: String },
    },
    meta: { type: Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });
AuditLogSchema.index({ createdAt: -1 });
// ✅ virtual so you can populate('actor')
AuditLogSchema.virtual('actor', {
    ref: 'User',
    localField: 'actorId',
    foreignField: '_id',
    justOne: true,
});
export const AuditLog = model('AuditLog', AuditLogSchema);
