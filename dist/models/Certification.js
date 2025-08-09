// src/models/Certification.ts
import { Schema, model } from 'mongoose';
const CertificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true, unique: true },
    highestLevel: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], required: true },
    issuedAt: { type: Date, required: true },
    certificateId: { type: String, required: true, index: true, unique: true },
    pdfUrl: { type: String, default: null },
}, { timestamps: true });
export const Certification = model('Certification', CertificationSchema);
