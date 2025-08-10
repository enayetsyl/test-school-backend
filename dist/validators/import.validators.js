"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportRowSchema = exports.LevelEnum = void 0;
// src/validators/import.validators.ts
const zod_1 = require("zod");
exports.LevelEnum = zod_1.z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']); // must match your model
const nonEmpty = (label) => zod_1.z
    .string()
    .transform((s) => s?.trim() ?? '')
    .refine((s) => s.length > 0, `${label} is required`);
exports.ImportRowSchema = zod_1.z.object({
    competencyCode: nonEmpty('competencyCode'),
    level: exports.LevelEnum,
    prompt: nonEmpty('prompt'),
    option1: nonEmpty('option1'),
    option2: nonEmpty('option2'),
    option3: zod_1.z
        .string()
        .optional()
        .transform((s) => (s?.trim() ? s.trim() : undefined)),
    option4: zod_1.z
        .string()
        .optional()
        .transform((s) => (s?.trim() ? s.trim() : undefined)),
    correctIndex: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).transform((v) => Number(v)),
    isActive: zod_1.z
        .union([zod_1.z.string(), zod_1.z.boolean()])
        .optional()
        .transform((v) => {
        if (typeof v === 'boolean')
            return v;
        if (typeof v === 'string')
            return v.toLowerCase() === 'true';
        return undefined;
    }),
});
