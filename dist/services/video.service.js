"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mustGetActiveOwnedSession = mustGetActiveOwnedSession;
exports.saveChunk = saveChunk;
exports.assembleChunks = assembleChunks;
// src/services/video.service.ts
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const mongoose_1 = require("mongoose");
const env_1 = require("../config/env");
const error_1 = require("../utils/error");
const ExamSession_1 = require("../models/ExamSession");
const RecordingAsset_1 = require("../models/RecordingAsset");
function chunkDir(sessionId) {
    return node_path_1.default.join(env_1.env.VIDEO_DIR, sessionId);
}
function chunkPath(sessionId, index) {
    return node_path_1.default.join(chunkDir(sessionId), `chunk_${index}`);
}
function finalPath(sessionId, ext = '.webm') {
    return node_path_1.default.join(env_1.env.VIDEO_DIR, sessionId, `recording${ext}`);
}
/** Ensure the current user owns the active session. Return session doc. */
async function mustGetActiveOwnedSession(userId, sessionId) {
    const s = await ExamSession_1.ExamSession.findOne({ _id: sessionId, userId, status: 'active' });
    if (!s)
        throw new error_1.AppError('FORBIDDEN', 'Session not found or not active', 403);
    return s;
}
/** Save a raw chunk to disk atomically. */
async function saveChunk(params) {
    const { userId, sessionId, index, buffer, mime } = params;
    const session = await mustGetActiveOwnedSession(userId, sessionId);
    const dir = chunkDir(sessionId);
    await fs_extra_1.default.ensureDir(dir);
    const tmpFile = node_path_1.default.join(dir, `chunk_${index}.tmp`);
    const file = chunkPath(sessionId, index);
    await fs_extra_1.default.writeFile(tmpFile, buffer);
    await fs_extra_1.default.move(tmpFile, file, { overwrite: true });
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
async function assembleChunks(params) {
    const { sessionId, expectedExt = '.webm' } = params;
    const dir = chunkDir(sessionId);
    const exists = await fs_extra_1.default.pathExists(dir);
    if (!exists)
        return { assembled: false, reason: 'no-chunks' };
    const names = (await fs_extra_1.default.readdir(dir)).filter((n) => n.startsWith('chunk_'));
    if (names.length === 0)
        return { assembled: false, reason: 'no-chunks' };
    // Sort by numeric index
    const entries = names
        .map((n) => ({ n, i: Number(n.replace('chunk_', '')) }))
        .filter((e) => Number.isFinite(e.i))
        .sort((a, b) => a.i - b.i);
    const outPath = finalPath(sessionId, expectedExt);
    const outTmp = `${outPath}.tmp`;
    await fs_extra_1.default.ensureFile(outTmp);
    const out = fs_extra_1.default.createWriteStream(outTmp);
    for (const e of entries) {
        const p = node_path_1.default.join(dir, e.n);
        await new Promise((resolve, reject) => {
            const rs = fs_extra_1.default.createReadStream(p);
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
    const size = (await fs_extra_1.default.stat(outTmp)).size;
    await fs_extra_1.default.move(outTmp, outPath, { overwrite: true });
    // Record an asset (upsert by session)
    await RecordingAsset_1.RecordingAsset.updateOne({ sessionId: new mongoose_1.Types.ObjectId(sessionId) }, {
        $set: {
            kind: 'video',
            storagePath: outPath,
            sizeBytes: size,
            chunks: entries.length,
            completedAt: new Date(),
        },
    }, { upsert: true });
    // Update session meta (best-effort)
    await ExamSession_1.ExamSession.updateOne({ _id: sessionId }, {
        $set: {
            'videoRecordingMeta.assembledPath': outPath,
            'videoRecordingMeta.sizeBytes': size,
            'videoRecordingMeta.completedAt': new Date(),
        },
        $setOnInsert: { 'videoRecordingMeta.dir': dir },
    });
    return { assembled: true, path: outPath, sizeBytes: size, chunks: entries.length };
}
