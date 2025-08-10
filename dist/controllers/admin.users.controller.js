"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersCtrl = listUsersCtrl;
exports.getUserCtrl = getUserCtrl;
exports.createUserCtrl = createUserCtrl;
exports.updateUserCtrl = updateUserCtrl;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongodb_1 = require("mongodb");
// Prefer importing your actual model if exported:
//   import { User } from '../models/user.model';
// Fallback to global registry:
const User = mongoose_1.default.model('User');
async function listUsersCtrl(req, res) {
    const { page, limit, q, role, status } = req.query; // ← double-cast
    const pageNum = Number(page) || 1;
    const lim = Number(limit) || 20;
    const skip = (pageNum - 1) * lim;
    const filter = {};
    if (role)
        filter.role = role;
    if (status)
        filter.status = status;
    if (q?.trim()) {
        const t = q.trim();
        filter.$or = [{ name: { $regex: t, $options: 'i' } }, { email: { $regex: t, $options: 'i' } }];
    }
    const [items, total] = await Promise.all([
        User.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(lim)
            .select('_id name email role status createdAt updatedAt')
            .lean(),
        User.countDocuments(filter),
    ]);
    return res.json({
        success: true,
        meta: { page: pageNum, limit: lim, total, pageCount: Math.ceil(total / lim) },
        data: items,
    });
}
async function getUserCtrl(req, res) {
    const { id } = req.params;
    const doc = await User.findById(id)
        .select('_id name email role status createdAt updatedAt')
        .lean();
    if (!doc)
        return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, data: doc });
}
async function createUserCtrl(req, res) {
    const { name, email, role, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
        return res.status(409).json({ success: false, message: 'Email already in use' });
    const hash = await bcryptjs_1.default.hash(password, 10);
    const created = await User.create({ name, email, role, passwordHash: hash, status: 'active' });
    return res.status(201).json({
        success: true,
        message: 'User created',
        data: {
            _id: created._id,
            name: created.name,
            email: created.email,
            role: created.role,
            status: created.status,
        },
    });
}
async function updateUserCtrl(req, res) {
    const { id } = req.params;
    const actorId = req.user?.sub;
    const updates = {};
    for (const k of ['name', 'role', 'status']) {
        if (k in req.body)
            updates[k] = req.body[k];
    }
    if ('password' in req.body) {
        updates.password = await bcryptjs_1.default.hash(req.body.password, 10);
    }
    // Safeguards: cannot disable yourself; cannot change own role
    if (actorId && id === actorId) {
        if ('status' in updates && updates.status === 'disabled') {
            return res
                .status(400)
                .json({ success: false, message: 'You cannot disable your own account' });
        }
        if ('role' in updates) {
            return res.status(400).json({ success: false, message: 'You cannot change your own role' });
        }
    }
    try {
        const updated = await User.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).select('_id name email role status createdAt updatedAt');
        if (!updated)
            return res.status(404).json({ success: false, message: 'User not found' });
        return res.json({ success: true, message: 'User updated', data: updated });
    }
    catch (err) {
        if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
            return res.status(409).json({ success: false, message: 'Email already in use' });
        }
        throw err;
    }
}
