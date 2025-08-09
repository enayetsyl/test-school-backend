// src/controllers/video.controller.ts
import type { RequestHandler } from 'express';
import multer from 'multer';
import { asyncHandler } from '../utils/asyncHandler';
import { saveChunk } from '../services/video.service';
import { UploadChunkQuery } from '../validators/exam.validators';
import { AppError } from '../utils/error';

// Multer (memory): simple & safe for < ~10–20MB per chunk.
// If you expect very large chunks, switch to diskStorage.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB/chunk max
});

type MulterReq = Parameters<typeof upload.single>[0];

export const chunkMulter: MulterReq = 'chunk';

export const uploadChunkCtrl: RequestHandler = asyncHandler(async (req, res) => {
  const parsed = UploadChunkQuery.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid query', 400);
  }
  const { sessionId, index } = parsed.data;

  const file = (req as unknown as { file?: Express.Multer.File }).file;
  if (!file || !file.buffer) {
    throw new AppError('VALIDATION_ERROR', 'Missing file field "chunk"', 400);
  }

  const out = await saveChunk({
    userId: req.user!.sub,
    sessionId,
    index,
    buffer: file.buffer,
    mime: file.mimetype,
  });

  return res.ok(out, 'Chunk stored');
});

// Export the multer middleware so routes can compose:
// router.post(..., chunkUploadMulter, uploadChunkCtrl)
export const chunkUploadMulter = upload.single('chunk');
