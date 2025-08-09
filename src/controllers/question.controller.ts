// src/controllers/question.controller.ts
import type { Request, RequestHandler, Response } from 'express';
import multer from 'multer';
import { asyncHandler } from '../utils/asyncHandler';
import { logAudit } from '../services/audit.service';
import {
  listQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  importQuestions,
  type ImportRow,
} from '../services/question.service';
import { parseCsvBuffer, sendCsv } from '../utils/csv';
import { type Level, Question } from '../models/Question';

type MulterFile = Express.Multer.File;

export const listCtrl = asyncHandler(async (req: Request, res: Response) => {
  // level: typed w/out any
  const levelParam =
    typeof req.query.level === 'string' ? req.query.level.toUpperCase() : undefined;
  const allowedLevels = new Set<Level>(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
  const level =
    levelParam && allowedLevels.has(levelParam as Level) ? (levelParam as Level) : undefined;

  // isActive: robust coercion
  const isActive =
    typeof req.query.isActive === 'string'
      ? req.query.isActive === 'true'
      : typeof req.query.isActive === 'boolean'
        ? req.query.isActive
        : undefined;

  // Build options object without undefined fields
  const opts: Parameters<typeof listQuestions>[0] = {
    ...(req.query.page ? { page: Number(req.query.page) } : {}),
    ...(req.query.limit ? { limit: Number(req.query.limit) } : {}),
    ...(req.query.q ? { q: String(req.query.q) } : {}),
    ...(level ? { level } : {}),
    ...(req.query.competencyId ? { competencyId: String(req.query.competencyId) } : {}),
    ...(isActive !== undefined ? { isActive } : {}),
    ...(req.query.sortBy ? { sortBy: req.query.sortBy as 'createdAt' | 'level' | 'prompt' } : {}),
    ...(req.query.sortOrder ? { sortOrder: req.query.sortOrder as 'asc' | 'desc' } : {}),
  };

  const { items, meta } = await listQuestions(opts);
  return res.paginated(items, meta);
});

type IdParams = { id: string };

export const getCtrl: RequestHandler<IdParams> = asyncHandler(async (req, res) => {
  const { id } = req.params as IdParams;
  const q = await getQuestion(id);
  if (!q)
    return res
      .status(404)
      .json({ success: false, code: 'NOT_FOUND', message: 'Question not found' });
  return res.ok({ question: q });
});

/** ---------- CREATE */
export const createCtrl = asyncHandler(async (req, res) => {
  const q = await createQuestion(req.body);
  // If your logAudit is (actorId, action, target?, meta?), keep this:
  await logAudit(req.user!.sub, 'QUESTION_CREATE', { type: 'Question', id: q._id.toString() });
  // If your logAudit is (actorId, action, meta?), use:
  // await logAudit(req.user!.sub, 'QUESTION_CREATE', { id: q._id.toString() });
  return res.created({ question: q }, 'Question created');
});

/** ---------- UPDATE /:id */
export const updateCtrl: RequestHandler<IdParams> = asyncHandler(async (req, res) => {
  const { id } = req.params as IdParams;
  const q = await updateQuestion(id, req.body);

  // match your logAudit signature (see comment above)
  await logAudit(
    req.user!.sub,
    'QUESTION_UPDATE',
    { type: 'Question', id: q._id.toString() },
    { patch: req.body },
  );
  // or: await logAudit(req.user!.sub, 'QUESTION_UPDATE', { id: q._id.toString(), patch: req.body });

  return res.ok({ question: q }, 'Updated');
});

/** ---------- DELETE /:id */
export const deleteCtrl: RequestHandler<IdParams> = asyncHandler(async (req, res) => {
  const { id } = req.params as IdParams;
  const deleted = await deleteQuestion(id);
  // match your logAudit signature
  await logAudit(req.user!.sub, 'QUESTION_DELETE', { type: 'Question', id });
  // or: await logAudit(req.user!.sub, 'QUESTION_DELETE', { id });
  return res.ok({ question: deleted }, 'Question deleted');
});

/** ---------- CSV import/export **/
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
export const importMulter = upload.single('file');

/** Request type that includes `file` (if you don't want global augmentation) */
type RequestWithFile = Request & { file?: MulterFile; files?: MulterFile[] };

export const importCsvCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const file = (req as RequestWithFile).file;
  if (!file) {
    return res
      .status(400)
      .json({ success: false, code: 'VALIDATION_ERROR', message: 'CSV file is required' });
  }

  // Remove `any`: parse rows as your service ImportRow type
  const rows = await parseCsvBuffer<ImportRow>(file.buffer);
  const mode = (req.query.mode as 'upsert' | 'insert') ?? 'upsert';

  const result = await importQuestions(rows, mode);

  // match your logAudit signature
  await logAudit(req.user!.sub, 'QUESTION_IMPORT', undefined, { mode, ...result });
  // or: await logAudit(req.user!.sub, 'QUESTION_IMPORT', { mode, ...result });

  return res.ok(result, 'Import complete');
});

export const exportCsvCtrl: RequestHandler = asyncHandler(async (req, res) => {
  // Apply same filters as list for export
  const filter: Record<string, unknown> = {};
  if (req.query.level) filter.level = req.query.level;
  if (req.query.competencyId) filter.competencyId = req.query.competencyId;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
  if (req.query.q) filter['$text'] = { $search: String(req.query.q) };

  console.log('req', req.query);

  // For type safety during export
  type PopulatedQuestion = {
    level: Level;
    prompt: string;
    options: string[];
    correctIndex: number;
    isActive: boolean;
    competencyId?: { code?: string; name?: string };
  };

  const cursor = Question.find(filter)
    .populate({ path: 'competencyId', select: 'code name' })
    .cursor();

  async function* toRows() {
    for await (const doc of cursor) {
      const d = doc.toObject() as PopulatedQuestion;
      yield {
        competencyCode: d.competencyId?.code,
        level: d.level,
        prompt: d.prompt,
        option1: d.options?.[0],
        option2: d.options?.[1],
        option3: d.options?.[2],
        option4: d.options?.[3],
        correctIndex: d.correctIndex,
        isActive: d.isActive,
      };
    }
  }

  // match your logAudit signature
  await logAudit(req.user!.sub, 'QUESTION_EXPORT', undefined, { ...filter });
  // or: await logAudit(req.user!.sub, 'QUESTION_EXPORT', { ...filter });

  // If your sendCsv(res, filename, rows) has 3 args, keep as-is:
  return sendCsv(res, 'questions_export.csv', toRows());

  // If your sendCsv only takes (res, rows), then change to:
  // return sendCsv(res, toRows());
});
