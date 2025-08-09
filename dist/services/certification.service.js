// src/services/certification.service.ts
import path from 'node:path';
import fs from 'fs-extra';
import crypto from 'node:crypto';
import { Types } from 'mongoose';
import { Certification } from '../models/Certification';
import { User } from '../models/User';
import { env } from '../config/env';
import { AppError } from '../utils/error';
import { generateCertificatePDF } from '../utils/pdf';
/** Return the single (highest) certification for a user, if present. */
export function getMyCertification(userId) {
    return Certification.findOne({ userId: new Types.ObjectId(userId) });
}
export function getCertificationById(id) {
    return Certification.findById(id);
}
export async function verifyByPublicId(certificateId) {
    const cert = await Certification.findOne({ certificateId });
    if (!cert)
        throw new AppError('NOT_FOUND', 'Certificate not found', 404);
    const user = await User.findById(cert.userId).lean();
    return {
        certificateId: cert.certificateId,
        highestLevel: cert.highestLevel,
        issuedAt: cert.issuedAt,
        user: user ? { name: user.name, email: user.email } : undefined,
    };
}
/** Ensure a PDF exists for the certification; generate/update and persist path. */
export async function ensurePdfForCertificate(certId) {
    const cert = await Certification.findById(certId);
    if (!cert)
        throw new AppError('NOT_FOUND', 'Certificate not found', 404);
    const user = await User.findById(cert.userId).lean();
    if (!user)
        throw new AppError('NOT_FOUND', 'User not found', 404);
    const dir = path.join(env.UPLOAD_DIR, 'certificates', String(cert.userId));
    const outPath = path.join(dir, `${cert.certificateId}.pdf`);
    const needGen = !cert.pdfUrl ||
        cert.pdfUrl !== outPath ||
        !(await fs.pathExists(cert.pdfUrl).catch(() => false));
    if (needGen) {
        await generateCertificatePDF({
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
export async function updateHighestCertificate(userId, highest) {
    // Fetch current
    const existing = await Certification.findOne({ userId: new Types.ObjectId(userId) });
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const isHigher = !existing || levelOrder.indexOf(highest) > levelOrder.indexOf(existing.highestLevel);
    if (!existing) {
        const doc = await Certification.create({
            userId: new Types.ObjectId(userId),
            highestLevel: highest,
            issuedAt: new Date(),
            certificateId: crypto.randomUUID(),
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
    existing.certificateId = crypto.randomUUID(); // new public id per new level
    existing.pdfUrl = null; // force regeneration
    await existing.save();
    await ensurePdfForCertificate(String(existing._id));
    return existing;
}
