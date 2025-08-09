// src/services/competency.service.ts
import { Competency } from '../models/Competency';
import { Question } from '../models/Question';
import { AppError } from '../utils/error';
export async function listCompetencies(opts) {
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
        Competency.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        Competency.countDocuments(filter),
    ]);
    return { items, meta: { page, limit, total } };
}
export async function createCompetency(data) {
    const exists = await Competency.findOne({ code: data.code });
    if (exists)
        throw new AppError('CONFLICT', 'Code already exists', 409);
    return Competency.create(data);
}
export async function getCompetency(id) {
    const c = await Competency.findById(id);
    if (!c)
        throw new AppError('NOT_FOUND', 'Competency not found', 404);
    return c;
}
export async function updateCompetency(id, data) {
    const c = await Competency.findByIdAndUpdate(id, data, { new: true });
    if (!c)
        throw new AppError('NOT_FOUND', 'Competency not found', 404);
    return c;
}
export async function deleteCompetency(id) {
    const inUse = await Question.countDocuments({ competencyId: id });
    console.log('inUse', inUse);
    if (inUse > 0) {
        throw new AppError('CONFLICT', 'Competency has questions; delete/transfer questions first', 409);
    }
    const res = await Competency.findByIdAndDelete(id);
    console.log('res', res);
    if (!res)
        throw new AppError('NOT_FOUND', 'Competency not found', 404);
    return res;
}
