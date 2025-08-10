"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = paginate;
async function paginate(model, req, filter = {}, options = {}) {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || options.defaultLimit || 10, options.maxLimit || 100);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        model.find(filter).skip(skip).limit(limit),
        model.countDocuments(filter),
    ]);
    return { items, meta: { page, limit, total } };
}
