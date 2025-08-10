"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfCtrl = exports.verifyCtrl = exports.getByIdCtrl = exports.meCtrl = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const asyncHandler_1 = require("../utils/asyncHandler");
const certification_service_1 = require("../services/certification.service");
const error_1 = require("../utils/error");
exports.meCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const cert = await (0, certification_service_1.getMyCertification)(req.user.sub);
    return cert ? res.ok({ certification: cert }) : res.ok({ certification: null });
});
exports.getByIdCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const cert = await (0, certification_service_1.getCertificationById)(req.params.id);
    if (!cert)
        throw new error_1.AppError('NOT_FOUND', 'Certificate not found', 404);
    return res.ok({ certification: cert });
});
exports.verifyCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const out = await (0, certification_service_1.verifyByPublicId)(req.params.certificateId);
    return res.ok(out, 'Verified');
});
exports.pdfCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const cert = await (0, certification_service_1.getCertificationById)(req.params.id);
    if (!cert)
        throw new error_1.AppError('NOT_FOUND', 'Certificate not found', 404);
    // Owner or admin can download
    const isOwner = String(cert.userId) === req.user.sub;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin)
        throw new error_1.AppError('FORBIDDEN', 'Not allowed', 403);
    const ensured = await (0, certification_service_1.ensurePdfForCertificate)(String(cert._id));
    const file = ensured.pdfUrl;
    const exists = await fs_extra_1.default.pathExists(file);
    if (!exists)
        throw new error_1.AppError('SERVER_ERROR', 'PDF missing', 500);
    return res.download(file, node_path_1.default.basename(file));
});
