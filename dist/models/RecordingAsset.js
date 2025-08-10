"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordingAsset = void 0;
// src/models/RecordingAsset.ts
const mongoose_1 = require("mongoose");
const RecordingAssetSchema = new mongoose_1.Schema({
    sessionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ExamSession', index: true, required: true },
    kind: { type: String, enum: ['video', 'audio'], default: 'video' },
    storagePath: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    durationSec: { type: Number },
    chunks: { type: Number },
    completedAt: { type: Date },
}, { timestamps: { createdAt: true, updatedAt: false } });
RecordingAssetSchema.index({ sessionId: 1 });
exports.RecordingAsset = (0, mongoose_1.model)('RecordingAsset', RecordingAssetSchema);
