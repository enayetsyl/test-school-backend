"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
// src/models/RefreshToken.ts
const mongoose_1 = require("mongoose");
const RefreshTokenSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date },
    ip: { type: String },
    userAgent: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });
RefreshTokenSchema.index({ userId: 1, tokenHash: 1 }, { unique: true });
exports.RefreshToken = (0, mongoose_1.model)('RefreshToken', RefreshTokenSchema);
