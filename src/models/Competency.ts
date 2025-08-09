// src/models/Competency.ts
import { Schema, model } from 'mongoose';
import type { Types, HydratedDocument } from 'mongoose';

export interface ICompetency extends Document {
  _id: Types.ObjectId | string;
  code: string; // e.g. "COMP-01" (unique)
  name: string; // e.g. "Email Security"
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CompetencyDoc = HydratedDocument<ICompetency>;

const CompetencySchema = new Schema<ICompetency>(
  {
    code: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50 },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true },
);

// Helpful indexes for admin search
CompetencySchema.index({ name: 1 });
CompetencySchema.index({ name: 'text', description: 'text' });

export const Competency = model<ICompetency>('Competency', CompetencySchema);
