// Narrower and eslint-safe check (no `any`)
function isZodSchema(s) {
    return !!s && typeof s.safeParse === 'function';
}
function replaceContents(target, src) {
    for (const k of Object.keys(target)) {
        delete target[k];
    }
    for (const [k, v] of Object.entries(src)) {
        target[k] = v;
    }
}
/**
 * Creates an Express middleware for validating request parts
 * using a Zod schema. Returns formatted error responses on failure.
 *
 * @param schema Zod schema or object with keys { body, query, params }
 */
export const validate = (schema) => (req, res, next) => {
    try {
        if (isZodSchema(schema)) {
            // Single schema → validate body
            const result = schema.safeParse(req.body);
            if (!result.success) {
                return sendZodError(res, result.error);
            }
            if (req.body && typeof req.body === 'object') {
                replaceContents(req.body, result.data);
            }
            else {
                // set when body is undefined or not an object
                req.body = result.data;
            }
        }
        else {
            // Multiple parts: body/query/params
            if (schema.body) {
                const parsed = schema.body.safeParse(req.body);
                if (!parsed.success) {
                    return sendZodError(res, parsed.error);
                }
                if (req.body && typeof req.body === 'object') {
                    replaceContents(req.body, parsed.data);
                }
                else {
                    req.body = parsed.data;
                }
            }
            if (schema.query) {
                const parsed = schema.query.safeParse(req.query);
                if (!parsed.success)
                    return sendZodError(res, parsed.error);
                // ⚠️ Express 5: mutate, don't assign
                replaceContents(req.query, parsed.data);
            }
            if (schema.params) {
                const parsed = schema.params.safeParse(req.params);
                if (!parsed.success)
                    return sendZodError(res, parsed.error);
                // ⚠️ Express 5: mutate, don't assign
                replaceContents(req.params, parsed.data);
            }
        }
        return next();
    }
    catch (err) {
        console.error('Validation middleware error:', err);
        return res.status(500).json({
            success: false,
            code: 'SERVER_ERROR',
            message: 'Validation middleware error',
        });
    }
};
/**
 * Maps ZodError to the API error format defined in project rules.
 */
function sendZodError(res, error) {
    const firstIssue = error.issues[0];
    return res.status(400).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: firstIssue?.message ?? 'Invalid request',
        details: {
            field: firstIssue?.path?.join('.') ?? undefined,
            issues: error.issues.map((i) => ({
                path: i.path,
                message: i.message,
            })),
        },
    });
}
