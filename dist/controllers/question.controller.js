"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportCsvCtrl = exports.importCsvCtrl = exports.importMulter = exports.deleteCtrl = exports.updateCtrl = exports.createCtrl = exports.getCtrl = exports.listCtrl = void 0;
const multer_1 = __importDefault(require("multer"));
const asyncHandler_1 = require("../utils/asyncHandler");
const audit_service_1 = require("../services/audit.service");
const question_service_1 = require("../services/question.service");
const csv_1 = require("../utils/csv");
const Question_1 = require("../models/Question");
const import_validators_1 = require("../validators/import.validators");
exports.listCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // level: typed w/out any
    const levelParam = typeof req.query.level === 'string' ? req.query.level.toUpperCase() : undefined;
    const allowedLevels = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
    const level = levelParam && allowedLevels.has(levelParam) ? levelParam : undefined;
    // isActive: robust coercion
    const isActive = typeof req.query.isActive === 'string'
        ? req.query.isActive === 'true'
        : typeof req.query.isActive === 'boolean'
            ? req.query.isActive
            : undefined;
    // Build options object without undefined fields
    const opts = {
        ...(req.query.page ? { page: Number(req.query.page) } : {}),
        ...(req.query.limit ? { limit: Number(req.query.limit) } : {}),
        ...(req.query.q ? { q: String(req.query.q) } : {}),
        ...(level ? { level } : {}),
        ...(req.query.competencyId ? { competencyId: String(req.query.competencyId) } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(req.query.sortBy ? { sortBy: req.query.sortBy } : {}),
        ...(req.query.sortOrder ? { sortOrder: req.query.sortOrder } : {}),
    };
    const { items, meta } = await (0, question_service_1.listQuestions)(opts);
    return res.paginated(items, meta);
});
exports.getCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const q = await (0, question_service_1.getQuestion)(id);
    if (!q)
        return res
            .status(404)
            .json({ success: false, code: 'NOT_FOUND', message: 'Question not found' });
    return res.ok({ question: q });
});
/** ---------- CREATE */
exports.createCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const q = await (0, question_service_1.createQuestion)(req.body);
    // If your logAudit is (actorId, action, target?, meta?), keep this:
    await (0, audit_service_1.logAudit)(req.user.sub, 'QUESTION_CREATE', { type: 'Question', id: q._id.toString() });
    // If your logAudit is (actorId, action, meta?), use:
    // await logAudit(req.user!.sub, 'QUESTION_CREATE', { id: q._id.toString() });
    return res.created({ question: q }, 'Question created');
});
/** ---------- UPDATE /:id */
exports.updateCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const q = await (0, question_service_1.updateQuestion)(id, req.body);
    // match your logAudit signature (see comment above)
    await (0, audit_service_1.logAudit)(req.user.sub, 'QUESTION_UPDATE', { type: 'Question', id: q._id.toString() }, { patch: req.body });
    // or: await logAudit(req.user!.sub, 'QUESTION_UPDATE', { id: q._id.toString(), patch: req.body });
    return res.ok({ question: q }, 'Updated');
});
/** ---------- DELETE /:id */
exports.deleteCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const deleted = await (0, question_service_1.deleteQuestion)(id);
    // match your logAudit signature
    await (0, audit_service_1.logAudit)(req.user.sub, 'QUESTION_DELETE', { type: 'Question', id });
    // or: await logAudit(req.user!.sub, 'QUESTION_DELETE', { id });
    return res.ok({ question: deleted }, 'Question deleted');
});
/** ---------- CSV import/export **/
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
exports.importMulter = upload.single('file');
exports.importCsvCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const file = req.file;
    if (!file) {
        return res
            .status(400)
            .json({ success: false, code: 'VALIDATION_ERROR', message: 'CSV file is required' });
    }
    const rawRows = await (0, csv_1.parseCsvBuffer)(file.buffer);
    // zod-validate each row (note: use .issues, not .errors)
    const rows = [];
    const parseErrors = [];
    rawRows.forEach((r, i) => {
        const parsed = import_validators_1.ImportRowSchema.safeParse(r);
        if (!parsed.success) {
            parseErrors.push({ row: i + 1, error: parsed.error.issues.map((e) => e.message).join('; ') });
            return;
        }
        // Remove keys whose value is `undefined` so optional fields are truly "omitted"
        const clean = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== undefined));
        rows.push(clean);
    });
    const mode = req.query.mode ?? 'upsert';
    const result = await (0, question_service_1.importQuestions)(rows, mode);
    const payload = { ...result, parseErrors, totalRows: rawRows.length };
    // log everything
    await (0, audit_service_1.logAudit)(req.user.sub, 'QUESTION_IMPORT', undefined, { mode, ...payload });
    // If any kind of row error occurred → fail the request
    if (parseErrors.length || result.errors.length) {
        const failed = parseErrors.length + result.errors.length;
        return res.status(400).json({
            success: false,
            code: 'VALIDATION_ERROR',
            message: `${failed} row(s) failed validation`,
            data: payload,
        });
    }
    // No errors → success
    return res.ok(payload, 'Import complete');
});
exports.exportCsvCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Apply same filters as list for export
    const filter = {};
    if (req.query.level)
        filter.level = req.query.level;
    if (req.query.competencyId)
        filter.competencyId = req.query.competencyId;
    if (req.query.isActive !== undefined)
        filter.isActive = req.query.isActive === 'true';
    if (req.query.q)
        filter['$text'] = { $search: String(req.query.q) };
    const cursor = Question_1.Question.find(filter)
        .populate({ path: 'competencyId', select: 'code name' })
        .cursor();
    async function* toRows() {
        for await (const doc of cursor) {
            const d = doc.toObject();
            yield {
                competencyCode: d.competencyId?.code,
                level: d.level,
                prompt: d.prompt,
                option1: d.options?.[0],
                option2: d.options?.[1],
                option3: d.options?.[2],
                option4: d.options?.[3],
                correctIndex: d.correctIndex,
                isActive: d.isActive,
            };
        }
    }
    // match your logAudit signature
    await (0, audit_service_1.logAudit)(req.user.sub, 'QUESTION_EXPORT', undefined, { ...filter });
    // or: await logAudit(req.user!.sub, 'QUESTION_EXPORT', { ...filter });
    // If your sendCsv(res, filename, rows) has 3 args, keep as-is:
    return (0, csv_1.sendCsv)(res, 'questions_export.csv', toRows());
    // If your sendCsv only takes (res, rows), then change to:
    // return sendCsv(res, toRows());
});
