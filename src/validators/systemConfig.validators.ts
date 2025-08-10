// validators/systemConfig.validators.ts
import { z } from 'zod';

export const PatchSystemConfigSchema = {
  body: z
    .object({
      timePerQuestionSec: z.number().int().min(30).max(300).optional(),
      retakeLockMinutes: z
        .number()
        .int()
        .min(0)
        .max(24 * 60)
        .optional(),
      maxRetakes: z.number().int().min(0).max(10).optional(),
      sebMode: z.enum(['off', 'warn', 'enforce']).optional(),
    })
    .refine((v) => Object.keys(v).length > 0, { message: 'Provide at least one field to update.' }),
};

export const GetSystemConfigQuery = {}; // nothing for now
