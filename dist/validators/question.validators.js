"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportQuery = exports.ListQuestionQuery = exports.UpdateQuestionSchema = exports.CreateQuestionSchema = exports.QuestionIdParams = exports.LevelEnum = void 0;
// auth/validators/question.validator.ts
const zod_1 = require("zod");
exports.LevelEnum = zod_1.z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
exports.QuestionIdParams = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id'),
});
exports.CreateQuestionSchema = zod_1.z
    .object({
    competencyId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid competencyId'),
    level: exports.LevelEnum,
    prompt: zod_1.z.string().min(10).max(1000),
    options: zod_1.z.array(zod_1.z.string().min(1)).min(2).max(10),
    correctIndex: zod_1.z.number().int().nonnegative(),
    isActive: zod_1.z.boolean().optional(),
    meta: zod_1.z
        .object({
        difficulty: zod_1.z.enum(['easy', 'medium', 'hard']).optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    })
        .optional(),
})
    .refine((v) => v.correctIndex < v.options.length, {
    message: 'correctIndex must reference an item in options',
    path: ['correctIndex'],
});
exports.UpdateQuestionSchema = exports.CreateQuestionSchema.partial().refine((v) => {
    if (!v.options || v.correctIndex === undefined)
        return true;
    return v.correctIndex < v.options.length;
}, { message: 'correctIndex must reference an item in options', path: ['correctIndex'] });
exports.ListQuestionQuery = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).optional(),
    q: zod_1.z.string().optional(),
    level: exports.LevelEnum.optional(),
    competencyId: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
    sortBy: zod_1.z.enum(['createdAt', 'level', 'prompt']).default('createdAt').optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc').optional(),
});
exports.ImportQuery = zod_1.z.object({
    mode: zod_1.z.enum(['upsert', 'insert']).default('upsert').optional(),
});
