// validators/admin.sessions.validators.ts
import { z } from 'zod';

export const ListSessionsQuery = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().trim().optional(),
    status: z.enum(['pending', 'active', 'submitted', 'cancelled']).optional(),
    step: z.coerce.number().int().min(1).max(3).optional(),
    userId: z.string().optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  }),
};

export const SessionIdParams = {
  params: z.object({ id: z.string().min(1) }),
};

// ✅ export TS types for safe casting in controllers
export type ListSessionsQueryType = z.infer<typeof ListSessionsQuery.query>;
export type SessionIdParamsType = z.infer<typeof SessionIdParams.params>;
