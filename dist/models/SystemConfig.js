"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemConfig = void 0;
exports.loadSystemConfig = loadSystemConfig;
// src/models/systemConfig.ts
const mongoose_1 = require("mongoose");
const SystemConfigSchema = new mongoose_1.Schema({
    _id: { type: String, default: 'singleton' }, // keep it single-document
    timePerQuestionSec: { type: Number, default: 90, min: 30, max: 300 },
    retakeLockMinutes: { type: Number, default: 60, min: 0, max: 24 * 60 },
    maxRetakes: { type: Number, default: 3, min: 0, max: 10 },
    sebMode: { type: String, enum: ['off', 'warn', 'enforce'], default: 'warn' },
}, { timestamps: true, versionKey: false });
exports.SystemConfig = (0, mongoose_1.model)('SystemConfig', SystemConfigSchema);
// Helper for callers that need config with sensible defaults
async function loadSystemConfig() {
    const existing = await exports.SystemConfig.findById('singleton');
    if (existing)
        return existing;
    return exports.SystemConfig.create({ _id: 'singleton' });
}
