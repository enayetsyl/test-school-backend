// src/utils/hasher.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as Bcrypt from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as BcryptJs from 'bcryptjs';

type BcryptLib = {
  hash(data: string, saltOrRounds: string | number): Promise<string>;
  compare(data: string, encrypted: string): Promise<boolean>;
};

let primary: BcryptLib | undefined;
let fallback: BcryptLib | undefined;

try {
  primary = (await import('bcrypt')) as unknown as BcryptLib;
} catch {
  // ignore load error
}
try {
  fallback = (await import('bcryptjs')) as unknown as BcryptLib;
} catch {
  // ignore load error
}

const libCandidate = primary ?? fallback;
if (!libCandidate) {
  throw new Error('No bcrypt/bcryptjs available. Please install at least one.');
}
const lib: BcryptLib = libCandidate; // ✅ Now TS knows it's defined

const DEFAULT_ROUNDS = 10 as const;

export async function hashPassword(
  plain: string,
  rounds: number = DEFAULT_ROUNDS,
): Promise<string> {
  return lib.hash(plain, rounds);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return lib.compare(plain, hash);
}
