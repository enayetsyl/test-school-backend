// src/controllers/competency.controller.ts
import type { Request, RequestHandler, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { logAudit } from '../services/audit.service';
import {
  listCompetencies,
  createCompetency,
  getCompetency,
  updateCompetency,
  deleteCompetency,
} from '../services/competency.service';

type IdParams = { id: string };

export const listCtrl = asyncHandler(async (req: Request, res: Response) => {
  console.log('controller', req.query);
  const opts = {
    ...(req.query.page ? { page: Number(req.query.page) } : {}),
    ...(req.query.limit ? { limit: Number(req.query.limit) } : {}),
    ...(req.query.q ? { q: String(req.query.q) } : {}),
    ...(req.query.sortBy ? { sortBy: req.query.sortBy as 'name' | 'code' | 'createdAt' } : {}),
    ...(req.query.sortOrder ? { sortOrder: req.query.sortOrder as 'asc' | 'desc' } : {}),
  };

  const { items, meta } = await listCompetencies(opts);
  return res.paginated(items, meta);
});

export const createCtrl = asyncHandler(async (req, res) => {
  const doc = await createCompetency(req.body);
  await logAudit(req.user!.sub, 'COMPETENCY_CREATE', {
    type: 'Competency',
    id: doc._id.toString(),
  });
  return res.created({ competency: doc }, 'Competency created');
});

export const getCtrl: RequestHandler<IdParams> = asyncHandler(async (req, res) => {
  const { id } = req.params as IdParams; // validated by your params schema
  const c = await getCompetency(id);
  return res.ok({ competency: c });
});

export const updateCtrl: RequestHandler<IdParams> = asyncHandler(async (req, res) => {
  const { id } = req.params as IdParams;
  const c = await updateCompetency(id, req.body);
  await logAudit(
    req.user!.sub,
    'COMPETENCY_UPDATE',
    { type: 'Competency', id: c._id.toString() },
    { patch: req.body },
  );
  return res.ok({ competency: c }, 'Updated');
});

export const deleteCtrl: RequestHandler<IdParams> = asyncHandler(async (req, res) => {
  const { id } = req.params as IdParams;
  console.log('comp id', id);
  const deleted = await deleteCompetency(id);
  await logAudit(req.user!.sub, 'COMPETENCY_DELETE', { type: 'Competency', id });
  return res.ok({ competency: deleted }, 'Competency deleted');
});
