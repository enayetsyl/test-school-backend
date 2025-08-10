"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadChunkQuery = exports.SessionIdParams = exports.ViolationBody = exports.SubmitBody = exports.AnswerBody = exports.StartExamBody = exports.StartExamQuery = exports.ObjectId = void 0;
// validators/exam.validators.ts
const zod_1 = require("zod");
exports.ObjectId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');
exports.StartExamQuery = zod_1.z.object({
    step: zod_1.z.coerce.number().int().min(1).max(3),
});
exports.StartExamBody = zod_1.z.object({
    screen: zod_1.z
        .object({ width: zod_1.z.number().int().positive(), height: zod_1.z.number().int().positive() })
        .optional(),
});
exports.AnswerBody = zod_1.z.object({
    sessionId: exports.ObjectId,
    questionId: exports.ObjectId,
    selectedIndex: zod_1.z.number().int().min(0),
    elapsedMs: zod_1.z.number().int().min(0).optional(),
});
exports.SubmitBody = zod_1.z.object({
    sessionId: exports.ObjectId,
});
exports.ViolationBody = zod_1.z.object({
    sessionId: exports.ObjectId,
    type: zod_1.z.enum(['TAB_BLUR', 'FULLSCREEN_EXIT', 'COPY', 'PASTE', 'RIGHT_CLICK']),
    meta: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
});
exports.SessionIdParams = zod_1.z.object({
    sessionId: exports.ObjectId,
});
exports.UploadChunkQuery = zod_1.z.object({
    sessionId: exports.ObjectId,
    index: zod_1.z.coerce.number().int().min(0),
});
