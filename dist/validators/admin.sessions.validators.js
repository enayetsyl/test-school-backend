"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionIdParams = exports.ListSessionsQuery = void 0;
// validators/admin.sessions.validators.ts
const zod_1 = require("zod");
exports.ListSessionsQuery = {
    query: zod_1.z.object({
        page: zod_1.z.coerce.number().int().min(1).default(1),
        limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
        q: zod_1.z.string().trim().optional(),
        status: zod_1.z.enum(['pending', 'active', 'submitted', 'cancelled']).optional(),
        step: zod_1.z.coerce.number().int().min(1).max(3).optional(),
        userId: zod_1.z.string().optional(),
        from: zod_1.z.coerce.date().optional(),
        to: zod_1.z.coerce.date().optional(),
    }),
};
exports.SessionIdParams = {
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
};
