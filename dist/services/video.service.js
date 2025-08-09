// src/services/video.service.ts
import path from 'node:path';
import fs from 'fs-extra';
import { Types } from 'mongoose';
import { env } from '../config/env';
import { AppError } from '../utils/error';
import { ExamSession } from '../models/ExamSession';
import { RecordingAsset } from '../models/RecordingAsset';
function chunkDir(sessionId) {
    return path.join(env.VIDEO_DIR, sessionId);
}
function chunkPath(sessionId, index) {
    return path.join(chunkDir(sessionId), `chunk_${index}`);
}
function finalPath(sessionId, ext = '.webm') {
    return path.join(env.VIDEO_DIR, sessionId, `recording${ext}`);
}
/** Ensure the current user owns the active session. Return session doc. */
export async function mustGetActiveOwnedSession(userId, sessionId) {
    const s = await ExamSession.findOne({ _id: sessionId, userId, status: 'active' });
    if (!s)
        throw new AppError('FORBIDDEN', 'Session not found or not active', 403);
    return s;
}
/** Save a raw chunk to disk atomically. */
export async function saveChunk(params) {
    const { userId, sessionId, index, buffer, mime } = params;
    const session = await mustGetActiveOwnedSession(userId, sessionId);
    const dir = chunkDir(sessionId);
    await fs.ensureDir(dir);
    const tmpFile = path.join(dir, `chunk_${index}.tmp`);
    const file = chunkPath(sessionId, index);
    await fs.writeFile(tmpFile, buffer);
    await fs.move(tmpFile, file, { overwrite: true });
    console.log('Saved chunk ->', file);
    // Track meta (best-effort; not required for correctness)
    session.videoRecordingMeta = {
        ...(session.videoRecordingMeta ?? {}),
        dir,
        mime: mime ?? session.videoRecordingMeta?.mime,
        chunks: Math.max(session.videoRecordingMeta?.chunks ?? 0, index + 1),
    };
    await session.save();
    return { stored: true, index, bytes: buffer.length };
}
/**
 * Assemble all chunks into a single file (ordered by index).
 * Makes a best-effort attempt and is safe to call multiple times.
 */
export async function assembleChunks(params) {
    const { sessionId, expectedExt = '.webm' } = params;
    const dir = chunkDir(sessionId);
    const exists = await fs.pathExists(dir);
    if (!exists)
        return { assembled: false, reason: 'no-chunks' };
    const names = (await fs.readdir(dir)).filter((n) => n.startsWith('chunk_'));
    if (names.length === 0)
        return { assembled: false, reason: 'no-chunks' };
    // Sort by numeric index
    const entries = names
        .map((n) => ({ n, i: Number(n.replace('chunk_', '')) }))
        .filter((e) => Number.isFinite(e.i))
        .sort((a, b) => a.i - b.i);
    const outPath = finalPath(sessionId, expectedExt);
    const outTmp = `${outPath}.tmp`;
    await fs.ensureFile(outTmp);
    const out = fs.createWriteStream(outTmp);
    for (const e of entries) {
        const p = path.join(dir, e.n);
        await new Promise((resolve, reject) => {
            const rs = fs.createReadStream(p);
            rs.on('error', reject);
            out.on('error', reject);
            rs.on('end', resolve);
            rs.pipe(out, { end: false });
        });
    }
    await new Promise((resolve, reject) => {
        out.on('error', reject);
        out.end(resolve);
    });
    const size = (await fs.stat(outTmp)).size;
    await fs.move(outTmp, outPath, { overwrite: true });
    // Record an asset (upsert by session)
    await RecordingAsset.updateOne({ sessionId: new Types.ObjectId(sessionId) }, {
        $set: {
            kind: 'video',
            storagePath: outPath,
            sizeBytes: size,
            chunks: entries.length,
            completedAt: new Date(),
        },
    }, { upsert: true });
    // Update session meta (best-effort)
    await ExamSession.updateOne({ _id: sessionId }, {
        $set: {
            'videoRecordingMeta.assembledPath': outPath,
            'videoRecordingMeta.sizeBytes': size,
            'videoRecordingMeta.completedAt': new Date(),
        },
        $setOnInsert: { 'videoRecordingMeta.dir': dir },
    });
    return { assembled: true, path: outPath, sizeBytes: size, chunks: entries.length };
}
