"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// src/models/User.ts
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String },
    role: {
        type: String,
        enum: ['admin', 'student', 'supervisor'],
        default: 'student',
        index: true,
    },
    passwordHash: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'disabled'], default: 'active' },
    isLockedFromStep1: { type: Boolean, default: false },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', UserSchema);
