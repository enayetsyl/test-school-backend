import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { type ListUsersQueryInput } from '../validators/admin.users.validators';
import { type AccessTokenPayload } from '../utils/jwt';
import { MongoServerError } from 'mongodb';

type AuthedRequest = Request & { user?: AccessTokenPayload };

// Prefer importing your actual model if exported:
//   import { User } from '../models/user.model';
// Fallback to global registry:
const User = mongoose.model('User');

export async function listUsersCtrl(req: Request, res: Response) {
  const { page, limit, q, role, status } = req.query as unknown as ListUsersQueryInput; // ← double-cast

  const pageNum = Number(page) || 1;
  const lim = Number(limit) || 20;
  const skip = (pageNum - 1) * lim;

  const filter: Record<string, unknown> = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
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

export async function getUserCtrl(req: Request, res: Response) {
  const { id } = req.params;
  const doc = await User.findById(id)
    .select('_id name email role status createdAt updatedAt')
    .lean();
  if (!doc) return res.status(404).json({ success: false, message: 'User not found' });
  return res.json({ success: true, data: doc });
}

export async function createUserCtrl(req: Request, res: Response) {
  const { name, email, role, password } = req.body as {
    name: string;
    email: string;
    role: 'admin' | 'student' | 'supervisor';
    password: string;
  };

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ success: false, message: 'Email already in use' });

  const hash = await bcrypt.hash(password, 10);
  const created = await User.create({ name, email, role, password: hash, status: 'active' });

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

export async function updateUserCtrl(req: AuthedRequest, res: Response) {
  const { id } = req.params;
  const actorId = req.user?.sub;

  const updates: Record<string, unknown> = {};
  for (const k of ['name', 'role', 'status'] as const) {
    if (k in req.body) updates[k] = req.body[k];
  }
  if ('password' in req.body) {
    updates.password = await bcrypt.hash(req.body.password, 10);
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
    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).select('_id name email role status createdAt updatedAt');
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, message: 'User updated', data: updated });
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }
    throw err;
  }
}
