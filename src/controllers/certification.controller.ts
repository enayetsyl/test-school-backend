// src/controllers/certification.controller.ts
import type { RequestHandler } from 'express';
import path from 'node:path';
import fs from 'fs-extra';
import { asyncHandler } from '../utils/asyncHandler';
import {
  getMyCertification,
  getCertificationById,
  verifyByPublicId,
  ensurePdfForCertificate,
} from '../services/certification.service';
import { AppError } from '../utils/error';

export const meCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const cert = await getMyCertification(req.user!.sub);
  return cert ? res.ok({ certification: cert }) : res.ok({ certification: null });
});

export const getByIdCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const cert = await getCertificationById(req.params.id as string);
  if (!cert) throw new AppError('NOT_FOUND', 'Certificate not found', 404);
  return res.ok({ certification: cert });
});

export const verifyCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const out = await verifyByPublicId(req.params.certificateId as string);
  return res.ok(out, 'Verified');
});

export const pdfCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const cert = await getCertificationById(req.params.id as string);
  if (!cert) throw new AppError('NOT_FOUND', 'Certificate not found', 404);

  // Owner or admin can download
  const isOwner = String(cert.userId) === req.user!.sub;
  const isAdmin = req.user!.role === 'admin';
  if (!isOwner && !isAdmin) throw new AppError('FORBIDDEN', 'Not allowed', 403);

  const ensured = await ensurePdfForCertificate(String(cert._id));
  const file = ensured.pdfUrl!;
  const exists = await fs.pathExists(file);
  if (!exists) throw new AppError('SERVER_ERROR', 'PDF missing', 500);

  return res.download(file, path.basename(file));
});
