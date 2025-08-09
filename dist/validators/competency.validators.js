// auth/validators/competency.validators.ts
import { z } from 'zod';
export const CompetencyIdParams = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id'),
});
export const CreateCompetencySchema = z.object({
    code: z.string().min(3).max(50),
    name: z.string().min(2).max(150),
    description: z.string().max(1000).optional(),
});
export const UpdateCompetencySchema = z.object({
    code: z.string().min(3).max(50).optional(),
    name: z.string().min(2).max(150).optional(),
    description: z.string().max(1000).optional(),
});
export const ListCompetencyQuery = z.object({
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
    q: z.string().optional(),
    sortBy: z.enum(['name', 'code', 'createdAt']).default('createdAt').optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc').optional(),
});
