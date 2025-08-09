let primary;
let fallback;
try {
    primary = (await import('bcrypt'));
}
catch {
    // ignore load error
}
try {
    fallback = (await import('bcryptjs'));
}
catch {
    // ignore load error
}
const libCandidate = primary ?? fallback;
if (!libCandidate) {
    throw new Error('No bcrypt/bcryptjs available. Please install at least one.');
}
const lib = libCandidate; // ✅ Now TS knows it's defined
const DEFAULT_ROUNDS = 10;
export async function hashPassword(plain, rounds = DEFAULT_ROUNDS) {
    return lib.hash(plain, rounds);
}
export async function comparePassword(plain, hash) {
    return lib.compare(plain, hash);
}
