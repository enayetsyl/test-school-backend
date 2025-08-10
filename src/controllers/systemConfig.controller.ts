// src/controllers/systemConfig.controller.ts
import type { Request, Response } from 'express';
import { SystemConfig, loadSystemConfig } from '../models/SystemConfig';

export async function getSystemConfigCtrl(_req: Request, res: Response) {
  const cfg = await loadSystemConfig();
  return res.json({ success: true, data: cfg });
}

export async function patchSystemConfigCtrl(req: Request, res: Response) {
  // Only set the fields provided (respect exactOptionalPropertyTypes)
  const $set: Record<string, unknown> = {};
  for (const k of ['timePerQuestionSec', 'retakeLockMinutes', 'maxRetakes', 'sebMode'] as const) {
    if (k in req.body) $set[k] = req.body[k];
  }

  const updated = await SystemConfig.findByIdAndUpdate(
    'singleton',
    { $set },
    { new: true, upsert: true },
  );
  return res.json({ success: true, message: 'Config updated', data: updated });
}
