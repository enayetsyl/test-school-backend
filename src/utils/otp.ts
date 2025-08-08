// src/utils/otp.ts
import crypto from 'node:crypto';
import { hashPassword, comparePassword } from './hasher';

export function generateNumericOtp(length = 6): string {
  // cryptographically strong digits (0-9)
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (b) => (b % 10).toString()).join('');
}

export async function hashOtp(otp: string): Promise<string> {
  return hashPassword(otp, 10); // faster rounds for OTP (short-lived)
}

export async function verifyOtp(otp: string, otpHash: string): Promise<boolean> {
  return comparePassword(otp, otpHash);
}
