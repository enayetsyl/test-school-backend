"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
// src/models/AuditLog.ts
const mongoose_1 = require("mongoose");
const AuditLogSchema = new mongoose_1.Schema({
    actorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    action: { type: String, required: true, index: true },
    target: {
        type: { type: String },
        id: { type: String },
    },
    meta: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });
AuditLogSchema.index({ createdAt: -1 });
// ✅ virtual so you can populate('actor')
AuditLogSchema.virtual('actor', {
    ref: 'User',
    localField: 'actorId',
    foreignField: '_id',
    justOne: true,
});
exports.AuditLog = (0, mongoose_1.model)('AuditLog', AuditLogSchema);
