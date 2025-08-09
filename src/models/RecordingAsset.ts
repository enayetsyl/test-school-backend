// src/models/RecordingAsset.ts
import { Schema, model } from 'mongoose';
import type { HydratedDocument, Types } from 'mongoose';

export interface IRecordingAsset {
  _id: Types.ObjectId | string;
  sessionId: Types.ObjectId;
  kind: 'video' | 'audio';
  storagePath: string; // absolute path (e.g., /tmp/testschool/videos/<session>/recording.webm)
  sizeBytes: number;
  durationSec?: number;
  chunks?: number;
  createdAt: Date;
  completedAt?: Date;
}

export type RecordingAssetDoc = HydratedDocument<IRecordingAsset>;

const RecordingAssetSchema = new Schema<IRecordingAsset>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: 'ExamSession', index: true, required: true },
    kind: { type: String, enum: ['video', 'audio'], default: 'video' },
    storagePath: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    durationSec: { type: Number },
    chunks: { type: Number },
    completedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

RecordingAssetSchema.index({ sessionId: 1 });

export const RecordingAsset = model<IRecordingAsset>('RecordingAsset', RecordingAssetSchema);
