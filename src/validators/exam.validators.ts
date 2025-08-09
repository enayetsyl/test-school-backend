// auth/validators/exam.validators.ts
import { z } from 'zod';

export const ObjectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const StartExamQuery = z.object({
  step: z.coerce.number().int().min(1).max(3),
});
export const StartExamBody = z.object({
  screen: z
    .object({ width: z.number().int().positive(), height: z.number().int().positive() })
    .optional(),
});

export const AnswerBody = z.object({
  sessionId: ObjectId,
  questionId: ObjectId,
  selectedIndex: z.number().int().min(0),
  elapsedMs: z.number().int().min(0).optional(),
});

export const SubmitBody = z.object({
  sessionId: ObjectId,
});

export const ViolationBody = z.object({
  sessionId: ObjectId,
  type: z.enum(['TAB_BLUR', 'FULLSCREEN_EXIT', 'COPY', 'PASTE', 'RIGHT_CLICK']),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const SessionIdParams = z.object({
  sessionId: ObjectId,
});
