"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCompetencies = listCompetencies;
exports.createCompetency = createCompetency;
exports.getCompetency = getCompetency;
exports.updateCompetency = updateCompetency;
exports.deleteCompetency = deleteCompetency;
// src/services/competency.service.ts
const Competency_1 = require("../models/Competency");
const Question_1 = require("../models/Question");
const error_1 = require("../utils/error");
async function listCompetencies(opts) {
    const page = Math.max(opts.page ?? 1, 1);
    const limit = Math.min(opts.limit ?? 10, 100);
    const skip = (page - 1) * limit;
    const filter = opts.q && opts.q.trim()
        ? {
            $or: [
                { name: { $regex: opts.q, $options: 'i' } },
                { code: { $regex: opts.q, $options: 'i' } },
                { description: { $regex: opts.q, $options: 'i' } },
            ],
        }
        : {};
    const sort = {
        [opts.sortBy ?? 'createdAt']: (opts.sortOrder ?? 'desc') === 'asc' ? 1 : -1,
    };
    const [items, total] = await Promise.all([
        Competency_1.Competency.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        Competency_1.Competency.countDocuments(filter),
    ]);
    return { items, meta: { page, limit, total } };
}
async function createCompetency(data) {
    const exists = await Competency_1.Competency.findOne({ code: data.code });
    if (exists)
        throw new error_1.AppError('CONFLICT', 'Code already exists', 409);
    return Competency_1.Competency.create(data);
}
async function getCompetency(id) {
    const c = await Competency_1.Competency.findById(id);
    if (!c)
        throw new error_1.AppError('NOT_FOUND', 'Competency not found', 404);
    return c;
}
async function updateCompetency(id, data) {
    const c = await Competency_1.Competency.findByIdAndUpdate(id, data, { new: true });
    if (!c)
        throw new error_1.AppError('NOT_FOUND', 'Competency not found', 404);
    return c;
}
async function deleteCompetency(id) {
    const inUse = await Question_1.Question.countDocuments({ competencyId: id });
    console.log('inUse', inUse);
    if (inUse > 0) {
        throw new error_1.AppError('CONFLICT', 'Competency has questions; delete/transfer questions first', 409);
    }
    const res = await Competency_1.Competency.findByIdAndDelete(id);
    console.log('res', res);
    if (!res)
        throw new error_1.AppError('NOT_FOUND', 'Competency not found', 404);
    return res;
}
