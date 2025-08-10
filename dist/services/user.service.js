"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.createUser = createUser;
exports.markEmailVerified = markEmailVerified;
exports.updatePassword = updatePassword;
// src/services/user.service.ts
const User_1 = require("../models/User");
async function findUserByEmail(email) {
    return User_1.User.findOne({ email });
}
async function createUser(data) {
    const user = await User_1.User.create({ ...data, emailVerified: false, status: 'active' });
    return user;
}
async function markEmailVerified(userId) {
    await User_1.User.updateOne({ _id: userId }, { $set: { emailVerified: true } });
}
async function updatePassword(userId, passwordHash) {
    await User_1.User.updateOne({ _id: userId }, { $set: { passwordHash } });
}
