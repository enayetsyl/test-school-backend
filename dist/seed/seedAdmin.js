"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/seed/seedAdmin.ts
const db_1 = require("../config/db");
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const hasher_1 = require("../utils/hasher");
async function run() {
    await (0, db_1.connectDB)();
    const email = env_1.env.SEED_ADMIN_EMAIL;
    const name = env_1.env.SEED_ADMIN_NAME;
    const pass = env_1.env.SEED_ADMIN_PASS;
    const existing = await User_1.User.findOne({ email });
    if (existing) {
        console.log('Admin already exists:', email);
        process.exit(0);
    }
    const passwordHash = await (0, hasher_1.hashPassword)(pass);
    await User_1.User.create({
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
