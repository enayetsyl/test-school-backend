// src/services/user.service.ts
import { User, type IUser } from '../models/User';

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function createUser(data: Pick<IUser, 'name' | 'email' | 'passwordHash' | 'role'>) {
  const user = await User.create({ ...data, emailVerified: false, status: 'active' });
  return user;
}

export async function markEmailVerified(userId: string) {
  await User.updateOne({ _id: userId }, { $set: { emailVerified: true } });
}

export async function updatePassword(userId: string, passwordHash: string) {
  await User.updateOne({ _id: userId }, { $set: { passwordHash } });
}
