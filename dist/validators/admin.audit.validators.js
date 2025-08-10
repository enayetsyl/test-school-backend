"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAuditQuery = exports.ListAuditQuerySchema = void 0;
// validators/admin.audit.validators.ts
const zod_1 = require("zod");
exports.ListAuditQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    actorId: zod_1.z.string().optional(),
    action: zod_1.z.string().trim().optional(),
    resource: zod_1.z.string().trim().optional(),
    from: zod_1.z.coerce.date().optional(),
    to: zod_1.z.coerce.date().optional(),
    q: zod_1.z.string().trim().optional(),
});
exports.ListAuditQuery = { query: exports.ListAuditQuerySchema };
