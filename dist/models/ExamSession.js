"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamSession = void 0;
// src/models/ExamSession.ts
const mongoose_1 = require("mongoose");
const QuestionSub = new mongoose_1.Schema({
    questionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Question', required: true },
    competencyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Competency', required: true },
    level: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], required: true },
    order: { type: Number, required: true, min: 1, max: 200 },
}, { _id: false });
const AnswerSub = new mongoose_1.Schema({
    questionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedIndex: { type: Number },
    isCorrect: { type: Boolean },
    answeredAt: { type: Date },
    elapsedMs: { type: Number },
}, { _id: false });
const ViolationSub = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['TAB_BLUR', 'FULLSCREEN_EXIT', 'COPY', 'PASTE', 'RIGHT_CLICK'],
        required: true,
    },
    occurredAt: { type: Date, required: true },
    meta: { type: mongoose_1.Schema.Types.Mixed },
}, { _id: false });
const ExamSessionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
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
    videoRecordingMeta: {
        dir: { type: String },
        mime: { type: String },
        chunks: { type: Number },
        assembledPath: { type: String },
        sizeBytes: { type: Number },
        completedAt: { type: Date },
    },
}, { timestamps: true });
ExamSessionSchema.index({ userId: 1, step: 1, status: 1 });
ExamSessionSchema.index({ 'questions.questionId': 1 }, { sparse: true });
exports.ExamSession = (0, mongoose_1.model)('ExamSession', ExamSessionSchema);
