// src/validators/import.validators.ts
import { z } from 'zod';
import { type Level } from '../models/Question';

export const LevelEnum = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']); // must match your model

const nonEmpty = (label: string) =>
  z
    .string()
    .transform((s) => s?.trim() ?? '')
    .refine((s) => s.length > 0, `${label} is required`);

export const ImportRowSchema = z.object({
  competencyCode: nonEmpty('competencyCode'),
  level: LevelEnum as unknown as z.ZodType<Level>,
  prompt: nonEmpty('prompt'),
  option1: nonEmpty('option1'),
  option2: nonEmpty('option2'),
  option3: z
    .string()
    .optional()
    .transform((s) => (s?.trim() ? s.trim() : undefined)),
  option4: z
    .string()
    .optional()
    .transform((s) => (s?.trim() ? s.trim() : undefined)),
  correctIndex: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  isActive: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((v) => {
      if (typeof v === 'boolean') return v;
      if (typeof v === 'string') return v.toLowerCase() === 'true';
      return undefined;
    }),
});

export type ImportRowValidated = z.infer<typeof ImportRowSchema>;
