// src/utils/hasher.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as Bcrypt from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as BcryptJs from 'bcryptjs';

type BcryptLib = {
  hash(data: string, saltOrRounds: string | number): Promise<string>;
  compare(data: string, encrypted: string): Promise<boolean>;
};

const DEFAULT_ROUNDS = 10 as const;

// Lazy-load bcrypt with fallback to bcryptjs (no top-level await)
const libPromise: Promise<BcryptLib> = (async () => {
  try {
    const mod = await import('bcrypt');
    return mod as unknown as BcryptLib;
  } catch {
    try {
      const mod = await import('bcryptjs');
      return mod as unknown as BcryptLib;
    } catch {
      throw new Error('No bcrypt/bcryptjs available. Please install at least one.');
    }
  }
})();

export async function hashPassword(
  plain: string,
  rounds: number = DEFAULT_ROUNDS,
): Promise<string> {
  const lib = await libPromise;
  return lib.hash(plain, rounds);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  const lib = await libPromise;
  return lib.compare(plain, hash);
}
