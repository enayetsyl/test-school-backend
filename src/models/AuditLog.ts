// src/models/AuditLog.ts
import { Schema, model } from 'mongoose';
import type { Types, Document, HydratedDocument } from 'mongoose';

export interface IAuditLog extends Document {
  _id: Types.ObjectId | string;
  actorId: Types.ObjectId;
  action: string; // e.g. COMPETENCY_CREATE, QUESTION_IMPORT
  target?: { type: string; id: string };
  meta?: Record<string, unknown>;
  createdAt: Date;
}

export type AuditLogDoc = HydratedDocument<IAuditLog>;

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    action: { type: String, required: true, index: true },
    target: {
      type: { type: String },
      id: { type: String },
    },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = model<IAuditLog>('AuditLog', AuditLogSchema);
