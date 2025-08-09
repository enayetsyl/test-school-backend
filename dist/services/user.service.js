// src/services/user.service.ts
import { User } from '../models/User';
export async function findUserByEmail(email) {
    return User.findOne({ email });
}
export async function createUser(data) {
    const user = await User.create({ ...data, emailVerified: false, status: 'active' });
    return user;
}
export async function markEmailVerified(userId) {
    await User.updateOne({ _id: userId }, { $set: { emailVerified: true } });
}
export async function updatePassword(userId, passwordHash) {
    await User.updateOne({ _id: userId }, { $set: { passwordHash } });
}
