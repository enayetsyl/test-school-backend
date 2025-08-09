// src/middleware/validation.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import type { ZodError, ZodTypeAny } from 'zod';

type SchemaParts = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

// Narrower and eslint-safe check (no `any`)
function isZodSchema(s: unknown): s is ZodTypeAny {
  return !!s && typeof (s as ZodTypeAny).safeParse === 'function';
}

function replaceContents(target: Record<string, unknown>, src: Record<string, unknown>) {
  for (const k of Object.keys(target)) {
    delete (target as Record<string, unknown>)[k];
  }
  for (const [k, v] of Object.entries(src)) {
    (target as Record<string, unknown>)[k] = v;
  }
}

/**
 * Creates an Express middleware for validating request parts
 * using a Zod schema. Returns formatted error responses on failure.
 *
 * @param schema Zod schema or object with keys { body, query, params }
 */
export const validate =
  (schema: ZodTypeAny | SchemaParts) => (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isZodSchema(schema)) {
        // Single schema → validate body
        const result = schema.safeParse(req.body);
        if (!result.success) {
          return sendZodError(res, result.error);
        }
        if (req.body && typeof req.body === 'object') {
          replaceContents(
            req.body as unknown as Record<string, unknown>,
            result.data as unknown as Record<string, unknown>,
          );
        } else {
          // set when body is undefined or not an object
          (req as unknown as { body: unknown }).body = result.data as unknown;
        }
      } else {
        // Multiple parts: body/query/params
        if (schema.body) {
          const parsed = schema.body.safeParse(req.body);
          if (!parsed.success) {
            return sendZodError(res, parsed.error);
          }
          if (req.body && typeof req.body === 'object') {
            replaceContents(
              req.body as unknown as Record<string, unknown>,
              parsed.data as unknown as Record<string, unknown>,
            );
          } else {
            (req as unknown as { body: unknown }).body = parsed.data as unknown;
          }
        }
        if (schema.query) {
          const parsed = schema.query.safeParse(req.query);
          if (!parsed.success) return sendZodError(res, parsed.error);
          // ⚠️ Express 5: mutate, don't assign
          replaceContents(
            req.query as unknown as Record<string, unknown>,
            parsed.data as unknown as Record<string, unknown>,
          );
        }
        if (schema.params) {
          const parsed = schema.params.safeParse(req.params);
          if (!parsed.success) return sendZodError(res, parsed.error);
          // ⚠️ Express 5: mutate, don't assign
          replaceContents(
            req.params as unknown as Record<string, unknown>,
            parsed.data as unknown as Record<string, unknown>,
          );
        }
      }
      return next();
    } catch (err) {
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
function sendZodError(res: Response, error: ZodError) {
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
