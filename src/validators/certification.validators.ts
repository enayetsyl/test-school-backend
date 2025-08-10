// validators/certification.validators.ts
import { z } from 'zod';

export const ObjectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const CertIdParams = z.object({ id: ObjectId });
export const VerifyPublicIdParams = z.object({
  certificateId: z.string().min(10).max(100),
});
