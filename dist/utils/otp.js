"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNumericOtp = generateNumericOtp;
exports.hashOtp = hashOtp;
exports.verifyOtp = verifyOtp;
// src/utils/otp.ts
const node_crypto_1 = __importDefault(require("node:crypto"));
const hasher_1 = require("./hasher");
function generateNumericOtp(length = 6) {
    // cryptographically strong digits (0-9)
    const bytes = node_crypto_1.default.randomBytes(length);
    return Array.from(bytes, (b) => (b % 10).toString()).join('');
}
async function hashOtp(otp) {
    return (0, hasher_1.hashPassword)(otp, 10); // faster rounds for OTP (short-lived)
}
async function verifyOtp(otp, otpHash) {
    return (0, hasher_1.comparePassword)(otp, otpHash);
}
