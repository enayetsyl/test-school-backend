"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificatePDF = generateCertificatePDF;
// src/utils/pdf.ts
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_path_1 = __importDefault(require("node:path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
async function generateCertificatePDF(input) {
    await fs_extra_1.default.ensureDir(node_path_1.default.dirname(input.outPath));
    const doc = new pdfkit_1.default({
        size: 'A4',
        margins: { top: 72, right: 72, bottom: 72, left: 72 },
    });
    const tmp = `${input.outPath}.tmp`;
    const stream = fs_extra_1.default.createWriteStream(tmp);
    doc.pipe(stream);
    // Header
    doc.fontSize(22).text('Test_School – Certificate of Digital Competency', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(14).fillColor('#555').text('This certifies that', { align: 'center' });
    doc.moveDown(0.5);
    // Name
    doc.fontSize(28).fillColor('#000').text(input.name, { align: 'center' });
    doc.moveDown(0.25);
    doc.fontSize(12).fillColor('#333').text(input.email, { align: 'center' });
    doc.moveDown(1.5);
    doc.fontSize(16).fillColor('#000').text('has achieved the level', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(40).text(input.level, { align: 'center' });
    doc.moveDown(1.5);
    doc
        .fontSize(12)
        .fillColor('#333')
        .text(`Issued on: ${input.issuedAt.toISOString().slice(0, 10)}`, { align: 'center' });
    doc.text(`Certificate ID: ${input.certificateId}`, { align: 'center' });
    doc.moveDown(2);
    doc
        .fontSize(10)
        .fillColor('#777')
        .text('Verification: Provide this Certificate ID to verify via the public endpoint.', {
        align: 'center',
    });
    // Signature line (simple)
    doc.moveDown(3);
    doc.fontSize(12).fillColor('#000').text('__________________________', { align: 'center' });
    doc.fontSize(10).fillColor('#555').text('Authorized Signatory', { align: 'center' });
    doc.end();
    await new Promise((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
    await fs_extra_1.default.move(tmp, input.outPath, { overwrite: true });
    return { path: input.outPath };
}
