"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersQuery = exports.ListUsersQuerySchema = exports.UpdateUserSchema = exports.CreateUserSchema = exports.UserIdParams = void 0;
// validators/admin.user.validators.ts
const zod_1 = require("zod");
exports.UserIdParams = {
    params: zod_1.z.object({ id: zod_1.z.string().min(1) }),
};
exports.CreateUserSchema = {
    body: zod_1.z.object({
        name: zod_1.z.string().trim().min(1),
        email: zod_1.z.string().email(),
        role: zod_1.z.enum(['admin', 'student', 'supervisor']),
        password: zod_1.z.string().min(8), // require explicit password
    }),
};
exports.UpdateUserSchema = {
    body: zod_1.z
        .object({
        name: zod_1.z.string().trim().min(1).optional(),
        role: zod_1.z.enum(['admin', 'student', 'supervisor']).optional(),
        status: zod_1.z.enum(['active', 'disabled']).optional(),
        password: zod_1.z.string().min(8).optional(),
    })
        .refine((b) => Object.keys(b).length > 0, { message: 'Provide at least one field.' }),
};
exports.ListUsersQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    q: zod_1.z.string().trim().optional(),
    role: zod_1.z.enum(['admin', 'student', 'supervisor']).optional(),
    status: zod_1.z.enum(['active', 'disabled']).optional(),
});
exports.ListUsersQuery = { query: exports.ListUsersQuerySchema };
