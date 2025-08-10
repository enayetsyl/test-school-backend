"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listQuestions = listQuestions;
exports.getQuestion = getQuestion;
exports.createQuestion = createQuestion;
exports.updateQuestion = updateQuestion;
exports.deleteQuestion = deleteQuestion;
exports.importQuestions = importQuestions;
// src/services/question.service.ts
const mongoose_1 = require("mongoose");
const Question_1 = require("../models/Question");
const Competency_1 = require("../models/Competency");
const error_1 = require("../utils/error");
async function listQuestions(opts) {
    const page = Math.max(opts.page ?? 1, 1);
    const limit = Math.min(opts.limit ?? 10, 100);
    const skip = (page - 1) * limit;
    const filter = {};
    if (opts.q)
        filter['$text'] = { $search: opts.q };
    if (opts.level)
        filter.level = opts.level;
    if (opts.competencyId)
        filter.competencyId = new mongoose_1.Types.ObjectId(opts.competencyId);
    if (opts.isActive !== undefined)
        filter.isActive = opts.isActive;
    const sort = {
        [opts.sortBy ?? 'createdAt']: (opts.sortOrder ?? 'desc') === 'asc' ? 1 : -1,
    };
    const [items, total] = await Promise.all([
        Question_1.Question.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate({ path: 'competencyId', select: 'name' })
            .lean(),
        Question_1.Question.countDocuments(filter),
    ]);
    return { items, meta: { page, limit, total } };
}
function getQuestion(id) {
    return Question_1.Question.findById(id);
}
async function createQuestion(data) {
    try {
        return await Question_1.Question.create({
            ...data,
            competencyId: new mongoose_1.Types.ObjectId(data.competencyId),
        });
    }
    catch (e) {
        // unique index on (competencyId, level)
        console.log(e);
        throw new error_1.AppError('CONFLICT', 'Question for this competency and level already exists', 409);
    }
}
async function updateQuestion(id, patch) {
    const q = await Question_1.Question.findByIdAndUpdate(id, patch, { new: true });
    if (!q)
        throw new error_1.AppError('NOT_FOUND', 'Question not found', 404);
    return q;
}
async function deleteQuestion(id) {
    const res = await Question_1.Question.findByIdAndDelete(id);
    if (!res)
        throw new error_1.AppError('NOT_FOUND', 'Question not found', 404);
    return res;
}
async function importQuestions(rows, mode) {
    const codes = Array.from(new Set(rows.map((r) => r.competencyCode?.trim()))).filter((c) => !!c);
    const comps = await Competency_1.Competency.find({ code: { $in: codes } }, { _id: 1, code: 1 }).lean();
    const codeToId = new Map(comps.map((c) => [String(c.code), String(c._id)]));
    // Use MONGOOSE bulk-write ops, not mongodb's
    const ops = [];
    const errors = [];
    rows.forEach((r, idx) => {
        const compId = codeToId.get(r.competencyCode);
        if (!compId) {
            errors.push({ row: idx + 1, error: `Unknown competencyCode: ${r.competencyCode}` });
            return;
        }
        const options = [r.option1, r.option2, r.option3, r.option4].filter((s) => !!s && s.trim().length > 0);
        const correctIndex = Number(r.correctIndex);
        if (Number.isNaN(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
            errors.push({ row: idx + 1, error: 'Invalid correctIndex for provided options' });
            return;
        }
        const competencyId = new mongoose_1.Types.ObjectId(compId);
        // Mongoose filter type
        const filter = { competencyId, level: r.level };
        const update = {
            $setOnInsert: { competencyId, level: r.level },
            $set: {
                prompt: r.prompt,
                options,
                correctIndex,
                isActive: typeof r.isActive === 'string' ? r.isActive === 'true' : (r.isActive ?? true),
                meta: { tags: [r.competencyCode] },
            },
        };
        ops.push(mode === 'insert'
            ? {
                insertOne: {
                    document: {
                        competencyId,
                        level: r.level,
                        prompt: r.prompt,
                        options,
                        correctIndex,
                        isActive: true,
                    },
                },
            }
            : { updateOne: { filter, update, upsert: true } });
    });
    let result = { inserted: 0, upserted: 0, matched: 0 };
    if (ops.length) {
        const res = await Question_1.Question.bulkWrite(ops, { ordered: false });
        result = {
            inserted: res.insertedCount ?? 0,
            upserted: res.upsertedCount ?? 0,
            matched: res.matchedCount ?? 0,
        };
    }
    return { ...result, errors };
}
