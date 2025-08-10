"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSystemConfigQuery = exports.PatchSystemConfigSchema = void 0;
// validators/systemConfig.validators.ts
const zod_1 = require("zod");
exports.PatchSystemConfigSchema = {
    body: zod_1.z
        .object({
        timePerQuestionSec: zod_1.z.number().int().min(30).max(300).optional(),
        retakeLockMinutes: zod_1.z
            .number()
            .int()
            .min(0)
            .max(24 * 60)
            .optional(),
        maxRetakes: zod_1.z.number().int().min(0).max(10).optional(),
        sebMode: zod_1.z.enum(['off', 'warn', 'enforce']).optional(),
    })
        .refine((v) => Object.keys(v).length > 0, { message: 'Provide at least one field to update.' }),
};
exports.GetSystemConfigQuery = {}; // nothing for now
