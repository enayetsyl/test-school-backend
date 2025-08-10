"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpToken = void 0;
// src/models/Question.ts
const mongoose_1 = require("mongoose");
const OtpTokenSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    channel: { type: String, enum: ['email'], default: 'email' },
    otpHash: { type: String, required: true },
    purpose: { type: String, enum: ['verify', 'reset'], required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    consumedAt: { type: Date },
}, { timestamps: { createdAt: true, updatedAt: false } });
// TTL index (Mongo will purge expired)
OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.OtpToken = (0, mongoose_1.model)('OtpToken', OtpTokenSchema);
