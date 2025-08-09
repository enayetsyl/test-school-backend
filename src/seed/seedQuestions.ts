// src/seed/seedQuestions.ts
import { Types } from 'mongoose';
import { connectDB } from '../config/db';
import { Competency } from '../models/Competency';
import { Question } from '../models/Question';

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/**
 * Optional helper to assign a rough difficulty by level.
 */
function difficultyFor(level: Level): 'easy' | 'medium' | 'hard' {
  if (level === 'A1' || level === 'A2') return 'easy';
  if (level === 'B1' || level === 'B2') return 'medium';
  return 'hard';
}

function makeOptions(level: Level, compName: string): string[] {
  // Keep deterministic to make upserts stable
  return [
    `Correct practice for ${compName} at ${level}`,
    `Irrelevant step for ${compName}`,
    `Risky approach to ${compName}`,
    `Outdated method for ${compName}`,
  ];
}

async function run() {
  await connectDB();

  const competencies = await Competency.find({}, { _id: 1, code: 1, name: 1 }).lean();
  if (competencies.length === 0) {
    console.error('No competencies found. Run seedCompetencies.ts first.');
    process.exit(1);
  }

  const ops = competencies.flatMap((c) =>
    LEVELS.map((lvl) => {
      const prompt = `[${c.code} • ${lvl}] Choose the best answer related to "${c.name}".`;
      const options = makeOptions(lvl, c.name);

      return {
        updateOne: {
          // Use (competencyId, level) as the natural key. We keep one MCQ per level per competency.
          filter: { competencyId: new Types.ObjectId(c._id), level: lvl },
          update: {
            $setOnInsert: {
              competencyId: new Types.ObjectId(c._id),
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
    }),
  );

  const res = await Question.bulkWrite(ops, { ordered: false });

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
