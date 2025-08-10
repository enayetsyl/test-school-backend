"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkUploadMulter = exports.uploadChunkCtrl = exports.chunkMulter = void 0;
const multer_1 = __importDefault(require("multer"));
const asyncHandler_1 = require("../utils/asyncHandler");
const video_service_1 = require("../services/video.service");
const exam_validators_1 = require("../validators/exam.validators");
const error_1 = require("../utils/error");
// Multer (memory): simple & safe for < ~10–20MB per chunk.
// If you expect very large chunks, switch to diskStorage.
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB/chunk max
});
exports.chunkMulter = 'chunk';
exports.uploadChunkCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const parsed = exam_validators_1.UploadChunkQuery.safeParse(req.query);
    if (!parsed.success) {
        throw new error_1.AppError('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid query', 400);
    }
    const { sessionId, index } = parsed.data;
    const file = req.file;
    if (!file || !file.buffer) {
        throw new error_1.AppError('VALIDATION_ERROR', 'Missing file field "chunk"', 400);
    }
    const out = await (0, video_service_1.saveChunk)({
        userId: req.user.sub,
        sessionId,
        index,
        buffer: file.buffer,
        mime: file.mimetype,
    });
    return res.ok(out, 'Chunk stored');
});
// Export the multer middleware so routes can compose:
// router.post(..., chunkUploadMulter, uploadChunkCtrl)
exports.chunkUploadMulter = upload.single('chunk');
