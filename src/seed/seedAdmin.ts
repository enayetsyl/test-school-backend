// src/seed/seedAdmin.ts
import { connectDB } from '../config/db';
import { env } from '../config/env';
import { User } from '../models/User';
import { hashPassword } from '../utils/hasher';

async function run() {
  await connectDB();
  const email = env.SEED_ADMIN_EMAIL;
  const name = env.SEED_ADMIN_NAME;
  const pass = env.SEED_ADMIN_PASS;

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  const passwordHash = await hashPassword(pass);
  await User.create({
    name,
    email,
    passwordHash,
    role: 'admin',
    emailVerified: true,
    status: 'active',
  });

  console.log('✅ Admin created:', email, 'password:', pass);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
