// src/models/RecordingAsset.ts
import { Schema, model } from 'mongoose';
const RecordingAssetSchema = new Schema({
    sessionId: { type: Schema.Types.ObjectId, ref: 'ExamSession', index: true, required: true },
    kind: { type: String, enum: ['video', 'audio'], default: 'video' },
    storagePath: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    durationSec: { type: Number },
    chunks: { type: Number },
    completedAt: { type: Date },
}, { timestamps: { createdAt: true, updatedAt: false } });
RecordingAssetSchema.index({ sessionId: 1 });
export const RecordingAsset = model('RecordingAsset', RecordingAssetSchema);
