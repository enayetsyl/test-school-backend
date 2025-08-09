// src/models/Question.ts
import { Schema, model } from 'mongoose';
import type { Types, HydratedDocument } from 'mongoose';

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface IQuestion extends Document {
  _id: Types.ObjectId | string;
  competencyId: Types.ObjectId;
  level: Level;
  prompt: string;
  options: string[]; // typically 4
  correctIndex: number; // 0-based
  isActive: boolean; // default true
  meta?: {
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export type QuestionDoc = HydratedDocument<IQuestion>;

const QuestionSchema = new Schema<IQuestion>(
  {
    competencyId: { type: Schema.Types.ObjectId, ref: 'Competency', required: true, index: true },
    level: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
      required: true,
      index: true,
    },
    prompt: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    options: {
      type: [String],
      required: true,
      validate: {
        validator(v: unknown[]) {
          return (
            Array.isArray(v) &&
            v.length >= 2 &&
            v.length <= 10 &&
            v.every((s) => typeof s === 'string' && s.trim().length > 0)
          );
        },
        message: 'options must be 2–10 non-empty strings',
      },
    },
    correctIndex: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    meta: {
      difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: false },
      tags: { type: [String], required: false, default: undefined },
    },
  },
  { timestamps: true },
);

// Ensure correctIndex < options.length
QuestionSchema.pre('validate', function (next) {
  const self = this as IQuestion & { isModified: (p: string) => boolean };
  if (Array.isArray(self.options) && typeof self.correctIndex === 'number') {
    if (self.correctIndex < 0 || self.correctIndex >= self.options.length) {
      return next(new Error('correctIndex must reference an item in options'));
    }
  }
  next();
});

// One question per (competency, level) — matches your seed strategy
QuestionSchema.index({ competencyId: 1, level: 1 }, { unique: true });

// Basic text search
QuestionSchema.index({ prompt: 'text' });

export const Question = model<IQuestion>('Question', QuestionSchema);
