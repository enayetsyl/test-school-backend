"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCertification = getMyCertification;
exports.getCertificationById = getCertificationById;
exports.verifyByPublicId = verifyByPublicId;
exports.ensurePdfForCertificate = ensurePdfForCertificate;
exports.updateHighestCertificate = updateHighestCertificate;
// src/services/certification.service.ts
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const mongoose_1 = require("mongoose");
const Certification_1 = require("../models/Certification");
const User_1 = require("../models/User");
const env_1 = require("../config/env");
const error_1 = require("../utils/error");
const pdf_1 = require("../utils/pdf");
/** Return the single (highest) certification for a user, if present. */
function getMyCertification(userId) {
    return Certification_1.Certification.findOne({ userId: new mongoose_1.Types.ObjectId(userId) });
}
function getCertificationById(id) {
    return Certification_1.Certification.findById(id);
}
async function verifyByPublicId(certificateId) {
    const cert = await Certification_1.Certification.findOne({ certificateId });
    if (!cert)
        throw new error_1.AppError('NOT_FOUND', 'Certificate not found', 404);
    const user = await User_1.User.findById(cert.userId).lean();
    return {
        certificateId: cert.certificateId,
        highestLevel: cert.highestLevel,
        issuedAt: cert.issuedAt,
        user: user ? { name: user.name, email: user.email } : undefined,
    };
}
/** Ensure a PDF exists for the certification; generate/update and persist path. */
async function ensurePdfForCertificate(certId) {
    const cert = await Certification_1.Certification.findById(certId);
    if (!cert)
        throw new error_1.AppError('NOT_FOUND', 'Certificate not found', 404);
    const user = await User_1.User.findById(cert.userId).lean();
    if (!user)
        throw new error_1.AppError('NOT_FOUND', 'User not found', 404);
    const dir = node_path_1.default.join(env_1.env.UPLOAD_DIR, 'certificates', String(cert.userId));
    const outPath = node_path_1.default.join(dir, `${cert.certificateId}.pdf`);
    const needGen = !cert.pdfUrl ||
        cert.pdfUrl !== outPath ||
        !(await fs_extra_1.default.pathExists(cert.pdfUrl).catch(() => false));
    if (needGen) {
        await (0, pdf_1.generateCertificatePDF)({
            outPath,
            name: user.name,
            email: user.email,
            level: cert.highestLevel,
            issuedAt: cert.issuedAt,
            certificateId: cert.certificateId,
        });
        cert.pdfUrl = outPath;
        await cert.save();
    }
    return cert;
}
/** Upsert and keep the user's highest achieved level; regenerate cert/pdf if level increases. */
async function updateHighestCertificate(userId, highest) {
    // Fetch current
    const existing = await Certification_1.Certification.findOne({ userId: new mongoose_1.Types.ObjectId(userId) });
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const isHigher = !existing || levelOrder.indexOf(highest) > levelOrder.indexOf(existing.highestLevel);
    if (!existing) {
        const doc = await Certification_1.Certification.create({
            userId: new mongoose_1.Types.ObjectId(userId),
            highestLevel: highest,
            issuedAt: new Date(),
            certificateId: node_crypto_1.default.randomUUID(),
        });
        await ensurePdfForCertificate(String(doc._id));
        return doc;
    }
    if (!isHigher) {
        // Still ensure PDF exists (might be missing after clean deploy)
        await ensurePdfForCertificate(String(existing._id));
        return existing;
    }
    existing.highestLevel = highest;
    existing.issuedAt = new Date();
    existing.certificateId = node_crypto_1.default.randomUUID(); // new public id per new level
    existing.pdfUrl = null; // force regeneration
    await existing.save();
    await ensurePdfForCertificate(String(existing._id));
    return existing;
}
