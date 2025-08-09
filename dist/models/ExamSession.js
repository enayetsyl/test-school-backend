// src/models/ExamSession.ts
import { Schema, model } from 'mongoose';
const QuestionSub = new Schema({
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    competencyId: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    level: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], required: true },
    order: { type: Number, required: true, min: 1, max: 200 },
}, { _id: false });
const AnswerSub = new Schema({
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedIndex: { type: Number },
    isCorrect: { type: Boolean },
    answeredAt: { type: Date },
    elapsedMs: { type: Number },
}, { _id: false });
const ViolationSub = new Schema({
    type: {
        type: String,
        enum: ['TAB_BLUR', 'FULLSCREEN_EXIT', 'COPY', 'PASTE', 'RIGHT_CLICK'],
        required: true,
    },
    occurredAt: { type: Date, required: true },
    meta: { type: Schema.Types.Mixed },
}, { _id: false });
const ExamSessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    step: { type: Number, enum: [1, 2, 3], index: true, required: true },
    status: {
        type: String,
        enum: ['active', 'submitted', 'expired', 'abandoned'],
        index: true,
        default: 'active',
    },
    timePerQuestionSec: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    questions: { type: [QuestionSub], required: true },
    answers: { type: [AnswerSub], required: true, default: [] },
    startAt: { type: Date, required: true },
    endAt: { type: Date },
    deadlineAt: { type: Date, required: true, index: true },
    scorePct: { type: Number },
    awardedLevel: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    violations: { type: [ViolationSub], default: [] },
    examClientInfo: {
        ip: String,
        userAgent: String,
        screen: { width: Number, height: Number },
        sebHeadersPresent: Boolean,
    },
}, { timestamps: true });
ExamSessionSchema.index({ userId: 1, step: 1, status: 1 });
ExamSessionSchema.index({ 'questions.questionId': 1 }, { sparse: true });
export const ExamSession = model('ExamSession', ExamSessionSchema);
