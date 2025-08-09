// src/models/Certification.ts
import { Schema, model } from 'mongoose';
import type { HydratedDocument, Types } from 'mongoose';
import type { Level } from './Question';

export interface ICertification {
  _id: Types.ObjectId | string;
  userId: Types.ObjectId;
  highestLevel: Level;
  issuedAt: Date;
  certificateId: string; // UUID-ish for public verification
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
export type CertificationDoc = HydratedDocument<ICertification>;

const CertificationSchema = new Schema<ICertification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true, unique: true },
    highestLevel: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], required: true },
    issuedAt: { type: Date, required: true },
    certificateId: { type: String, required: true, index: true, unique: true },
    pdfUrl: { type: String },
  },
  { timestamps: true },
);

export const Certification = model<ICertification>('Certification', CertificationSchema);
