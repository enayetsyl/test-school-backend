"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certification = void 0;
// src/models/Certification.ts
const mongoose_1 = require("mongoose");
const CertificationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true, unique: true },
    highestLevel: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], required: true },
    issuedAt: { type: Date, required: true },
    certificateId: { type: String, required: true, index: true, unique: true },
    pdfUrl: { type: String, default: null },
}, { timestamps: true });
exports.Certification = (0, mongoose_1.model)('Certification', CertificationSchema);
