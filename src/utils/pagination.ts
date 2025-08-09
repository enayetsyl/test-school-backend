import type { Request } from 'express';
import type { Model, FilterQuery } from 'mongoose';

export interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

export async function paginate<T>(
  model: Model<T>,
  req: Request,
  filter: FilterQuery<T> = {},
  options: PaginationOptions = {},
) {
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);
  const limit = Math.min(
    parseInt(req.query.limit as string) || options.defaultLimit || 10,
    options.maxLimit || 100,
  );
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    model.find(filter).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);

  return { items, meta: { page, limit, total } };
}
