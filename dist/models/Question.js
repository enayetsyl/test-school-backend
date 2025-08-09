// src/models/Question.ts
import { Schema, model } from 'mongoose';
const QuestionSchema = new Schema({
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
            validator(v) {
                return (Array.isArray(v) &&
                    v.length >= 2 &&
                    v.length <= 10 &&
                    v.every((s) => typeof s === 'string' && s.trim().length > 0));
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
}, { timestamps: true });
// One question per (competency, level) — matches your seed strategy
QuestionSchema.index({ competencyId: 1, level: 1 }, { unique: true });
export const Question = model('Question', QuestionSchema);
