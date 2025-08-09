// src/services/question.service.ts
import { Types } from 'mongoose';
import type {
  AnyBulkWriteOperation, // from mongoose (not mongodb)
  UpdateQuery, // from mongoose
  RootFilterQuery, // from mongoose
} from 'mongoose';
import { Question, type Level, type QuestionRaw } from '../models/Question';
import { Competency } from '../models/Competency';
import { AppError } from '../utils/error';

type ListOpts = {
  page?: number;
  limit?: number;
  q?: string;
  level?: Level;
  competencyId?: string;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'level' | 'prompt';
  sortOrder?: 'asc' | 'desc';
};

export async function listQuestions(opts: ListOpts) {
  const page = Math.max(opts.page ?? 1, 1);
  const limit = Math.min(opts.limit ?? 10, 100);
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (opts.q) filter['$text'] = { $search: opts.q };
  if (opts.level) filter.level = opts.level;
  if (opts.competencyId) filter.competencyId = new Types.ObjectId(opts.competencyId);
  if (opts.isActive !== undefined) filter.isActive = opts.isActive;

  const sort: Record<string, 1 | -1> = {
    [opts.sortBy ?? 'createdAt']: (opts.sortOrder ?? 'desc') === 'asc' ? 1 : -1,
  };

  const [items, total] = await Promise.all([
    Question.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Question.countDocuments(filter),
  ]);

  return { items, meta: { page, limit, total } };
}

export function getQuestion(id: string) {
  return Question.findById(id);
}

export async function createQuestion(data: {
  competencyId: string;
  level: Level;
  prompt: string;
  options: string[];
  correctIndex: number;
  isActive?: boolean;
  meta?: { difficulty?: 'easy' | 'medium' | 'hard'; tags?: string[] };
}) {
  try {
    return await Question.create({
      ...data,
      competencyId: new Types.ObjectId(data.competencyId),
    });
  } catch (e: unknown) {
    // unique index on (competencyId, level)
    console.log(e);
    throw new AppError('CONFLICT', 'Question for this competency and level already exists', 409);
  }
}

export async function updateQuestion(
  id: string,
  patch: Partial<Parameters<typeof createQuestion>[0]>,
) {
  const q = await Question.findByIdAndUpdate(id, patch, { new: true });
  if (!q) throw new AppError('NOT_FOUND', 'Question not found', 404);
  return q;
}

export async function deleteQuestion(id: string) {
  const res = await Question.findByIdAndDelete(id);
  if (!res) throw new AppError('NOT_FOUND', 'Question not found', 404);
  return res;
}

export type ImportRow = {
  competencyCode: string;
  level: Level;
  prompt: string;
  option1: string;
  option2: string;
  option3?: string;
  option4?: string;
  correctIndex: string | number;
  isActive?: string | boolean;
};

export async function importQuestions(rows: ImportRow[], mode: 'upsert' | 'insert') {
  const codes = Array.from(new Set(rows.map((r) => r.competencyCode?.trim()))).filter(
    (c): c is string => !!c,
  );

  const comps = await Competency.find({ code: { $in: codes } }, { _id: 1, code: 1 }).lean();
  const codeToId = new Map(comps.map((c) => [String(c.code), String(c._id)]));

  // Use MONGOOSE bulk-write ops, not mongodb's
  const ops: AnyBulkWriteOperation<QuestionRaw>[] = [];
  const errors: Array<{ row: number; error: string }> = [];

  rows.forEach((r, idx) => {
    const compId = codeToId.get(r.competencyCode);
    if (!compId) {
      errors.push({ row: idx + 1, error: `Unknown competencyCode: ${r.competencyCode}` });
      return;
    }

    const options = [r.option1, r.option2, r.option3, r.option4].filter(
      (s): s is string => !!s && s.trim().length > 0,
    );
    const correctIndex = Number(r.correctIndex);
    if (Number.isNaN(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      errors.push({ row: idx + 1, error: 'Invalid correctIndex for provided options' });
      return;
    }

    const competencyId = new Types.ObjectId(compId);

    // Mongoose filter type
    const filter: RootFilterQuery<QuestionRaw> = { competencyId, level: r.level };

    const update: UpdateQuery<QuestionRaw> = {
      $setOnInsert: { competencyId, level: r.level },
      $set: {
        prompt: r.prompt,
        options,
        correctIndex,
        isActive: typeof r.isActive === 'string' ? r.isActive === 'true' : (r.isActive ?? true),
        meta: { tags: [r.competencyCode] },
      },
    };

    ops.push(
      mode === 'insert'
        ? {
            insertOne: {
              document: {
                competencyId,
                level: r.level,
                prompt: r.prompt,
                options,
                correctIndex,
                isActive: true,
              },
            },
          }
        : { updateOne: { filter, update, upsert: true } },
    );
  });

  let result = { inserted: 0, upserted: 0, matched: 0 };
  if (ops.length) {
    const res = await Question.bulkWrite(ops, { ordered: false });
    result = {
      inserted: res.insertedCount ?? 0,
      upserted: res.upsertedCount ?? 0,
      matched: res.matchedCount ?? 0,
    };
  }

  return { ...result, errors };
}
