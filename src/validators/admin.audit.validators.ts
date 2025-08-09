// validators/admin.audit.validators.ts
import { z } from 'zod';
export const ListAuditQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  actorId: z.string().optional(),
  action: z.string().trim().optional(),
  resource: z.string().trim().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  q: z.string().trim().optional(),
});
export const ListAuditQuery = { query: ListAuditQuerySchema };
export type ListAuditQueryInput = z.infer<typeof ListAuditQuerySchema>;
