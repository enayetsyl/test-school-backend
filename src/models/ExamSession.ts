// src/models/ExamSession.ts
import { Schema, model } from 'mongoose';
import type { Types, HydratedDocument } from 'mongoose';
import type { Level } from './Question';

export type ExamStatus = 'active' | 'submitted' | 'expired' | 'abandoned';

export interface ISessionQuestion {
  questionId: Types.ObjectId;
  competencyId: Types.ObjectId;
  level: Level;
  order: number; // 1..44
}
export interface ISessionAnswer {
  questionId: Types.ObjectId;
  selectedIndex?: number;
  isCorrect?: boolean;
  answeredAt?: Date;
  elapsedMs?: number;
}
export type ViolationType = 'TAB_BLUR' | 'FULLSCREEN_EXIT' | 'COPY' | 'PASTE' | 'RIGHT_CLICK';
export interface IViolationEvent {
  type: ViolationType;
  occurredAt: Date;
  meta?: Record<string, unknown>;
}
export interface IExamSession {
  _id: Types.ObjectId | string;
  userId: Types.ObjectId;
  step: 1 | 2 | 3;
  status: ExamStatus;
  timePerQuestionSec: number;
  totalQuestions: number; // 44
  questions: ISessionQuestion[]; // frozen at start
  answers: ISessionAnswer[]; // updated as user answers
  startAt: Date;
  endAt?: Date;
  deadlineAt: Date; // start + total * timePerQuestion
  scorePct?: number; // computed on submit
  awardedLevel?: Level; // A1..C2 per step thresholds
  violations: IViolationEvent[];
  examClientInfo?: {
    ip?: string;
    userAgent?: string;
    screen?: { width: number; height: number };
    sebHeadersPresent?: boolean;
  };
  videoRecordingMeta?: {
    dir: string; // chunk directory
    mime?: string | undefined; // e.g., 'video/webm'
    chunks?: number; // highest index+1 we've seen (best-effort)
    assembledPath?: string; // final file path
    sizeBytes?: number; // final size (assembled)
    completedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type ExamSessionDoc = HydratedDocument<IExamSession>;

const QuestionSub = new Schema<ISessionQuestion>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    competencyId: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    level: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], required: true },
    order: { type: Number, required: true, min: 1, max: 200 },
  },
  { _id: false },
);

const AnswerSub = new Schema<ISessionAnswer>(
  {
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedIndex: { type: Number },
    isCorrect: { type: Boolean },
    answeredAt: { type: Date },
    elapsedMs: { type: Number },
  },
  { _id: false },
);

const ViolationSub = new Schema<IViolationEvent>(
  {
    type: {
      type: String,
      enum: ['TAB_BLUR', 'FULLSCREEN_EXIT', 'COPY', 'PASTE', 'RIGHT_CLICK'],
      required: true,
    },
    occurredAt: { type: Date, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  { _id: false },
);

const ExamSessionSchema = new Schema<IExamSession>(
  {
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
    videoRecordingMeta: {
      dir: { type: String },
      mime: { type: String },
      chunks: { type: Number },
      assembledPath: { type: String },
      sizeBytes: { type: Number },
      completedAt: { type: Date },
    },
  },
  { timestamps: true },
);

ExamSessionSchema.index({ userId: 1, step: 1, status: 1 });
ExamSessionSchema.index({ 'questions.questionId': 1 }, { sparse: true });

export const ExamSession = model<IExamSession>('ExamSession', ExamSessionSchema);
