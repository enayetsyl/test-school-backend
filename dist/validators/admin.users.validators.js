import { z } from 'zod';
export const UserIdParams = {
    params: z.object({ id: z.string().min(1) }),
};
export const CreateUserSchema = {
    body: z.object({
        name: z.string().trim().min(1),
        email: z.string().email(),
        role: z.enum(['admin', 'student', 'supervisor']),
        password: z.string().min(8), // require explicit password
    }),
};
export const UpdateUserSchema = {
    body: z
        .object({
        name: z.string().trim().min(1).optional(),
        role: z.enum(['admin', 'student', 'supervisor']).optional(),
        status: z.enum(['active', 'disabled']).optional(),
        password: z.string().min(8).optional(),
    })
        .refine((b) => Object.keys(b).length > 0, { message: 'Provide at least one field.' }),
};
export const ListUsersQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    q: z.string().trim().optional(),
    role: z.enum(['admin', 'student', 'supervisor']).optional(),
    status: z.enum(['active', 'disabled']).optional(),
});
export const ListUsersQuery = { query: ListUsersQuerySchema };
