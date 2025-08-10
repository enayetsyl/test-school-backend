"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/seed/seedQuestions.ts
const mongoose_1 = require("mongoose");
const db_1 = require("../config/db");
const Competency_1 = require("../models/Competency");
const Question_1 = require("../models/Question");
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
/**
 * Optional helper to assign a rough difficulty by level.
 */
function difficultyFor(level) {
    if (level === 'A1' || level === 'A2')
        return 'easy';
    if (level === 'B1' || level === 'B2')
        return 'medium';
    return 'hard';
}
function makeOptions(level, compName) {
    // Keep deterministic to make upserts stable
    return [
        `Correct practice for ${compName} at ${level}`,
        `Irrelevant step for ${compName}`,
        `Risky approach to ${compName}`,
        `Outdated method for ${compName}`,
    ];
}
async function run() {
    await (0, db_1.connectDB)();
    const competencies = await Competency_1.Competency.find({}, { _id: 1, code: 1, name: 1 }).lean();
    if (competencies.length === 0) {
        console.error('No competencies found. Run seedCompetencies.ts first.');
        process.exit(1);
    }
    const ops = competencies.flatMap((c) => LEVELS.map((lvl) => {
        const prompt = `[${c.code} • ${lvl}] Choose the best answer related to "${c.name}".`;
        const options = makeOptions(lvl, c.name);
        return {
            updateOne: {
                // Use (competencyId, level) as the natural key. We keep one MCQ per level per competency.
                filter: { competencyId: new mongoose_1.Types.ObjectId(c._id), level: lvl },
                update: {
                    $setOnInsert: {
                        competencyId: new mongoose_1.Types.ObjectId(c._id),
                        level: lvl,
                        prompt,
                        options,
                        correctIndex: 0,
                        isActive: true,
                        meta: { difficulty: difficultyFor(lvl), tags: [c.code, c.name] },
                    },
                },
                upsert: true,
            },
        };
    }));
    const res = await Question_1.Question.bulkWrite(ops, { ordered: false });
    const inserted = res.upsertedCount ?? 0;
    const matched = res.matchedCount ?? 0;
    // Expecting 22 * 6 = 132 questions total after first run
    console.log(`✅ Questions seeding complete. Inserted: ${inserted}, matched existing: ${matched}`);
    process.exit(0);
}
run().catch((e) => {
    console.error('Questions seed failed:', e);
    process.exit(1);
});
