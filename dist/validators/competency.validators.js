"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCompetencyQuery = exports.UpdateCompetencySchema = exports.CreateCompetencySchema = exports.CompetencyIdParams = void 0;
// auth/validators/competency.validators.ts
const zod_1 = require("zod");
exports.CompetencyIdParams = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id'),
});
exports.CreateCompetencySchema = zod_1.z.object({
    code: zod_1.z.string().min(3).max(50),
    name: zod_1.z.string().min(2).max(150),
    description: zod_1.z.string().max(1000).optional(),
});
exports.UpdateCompetencySchema = zod_1.z.object({
    code: zod_1.z.string().min(3).max(50).optional(),
    name: zod_1.z.string().min(2).max(150).optional(),
    description: zod_1.z.string().max(1000).optional(),
});
exports.ListCompetencyQuery = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).optional(),
    q: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(['name', 'code', 'createdAt']).default('createdAt').optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc').optional(),
});
