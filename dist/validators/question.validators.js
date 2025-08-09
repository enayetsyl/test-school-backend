// auth/validators/question.validator.ts
import { z } from 'zod';
export const LevelEnum = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
export const QuestionIdParams = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id'),
});
export const CreateQuestionSchema = z
    .object({
    competencyId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid competencyId'),
    level: LevelEnum,
    prompt: z.string().min(10).max(1000),
    options: z.array(z.string().min(1)).min(2).max(10),
    correctIndex: z.number().int().nonnegative(),
    isActive: z.boolean().optional(),
    meta: z
        .object({
        difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
        tags: z.array(z.string()).optional(),
    })
        .optional(),
})
    .refine((v) => v.correctIndex < v.options.length, {
    message: 'correctIndex must reference an item in options',
    path: ['correctIndex'],
});
export const UpdateQuestionSchema = CreateQuestionSchema.partial().refine((v) => {
    if (!v.options || v.correctIndex === undefined)
        return true;
    return v.correctIndex < v.options.length;
}, { message: 'correctIndex must reference an item in options', path: ['correctIndex'] });
export const ListQuestionQuery = z.object({
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    q: z.string().optional(),
    level: LevelEnum.optional(),
    competencyId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional(),
    isActive: z.coerce.boolean().optional(),
    sortBy: z.enum(['createdAt', 'level', 'prompt']).default('createdAt').optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});
export const ImportQuery = z.object({
    mode: z.enum(['upsert', 'insert']).default('upsert').optional(),
});
