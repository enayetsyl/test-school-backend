// src/seed/seedCompetencies.ts
import { connectDB } from '../config/db';
import { Competency } from '../models/Competency'; // expects fields: code (unique), name, description?

const COMPETENCIES: Array<{ code: string; name: string; description?: string }> = [
  { code: 'COMP-01', name: 'Email Security' },
  { code: 'COMP-02', name: 'Password Management' },
  { code: 'COMP-03', name: 'Phishing Awareness' },
  { code: 'COMP-04', name: 'Safe Web Browsing' },
  { code: 'COMP-05', name: 'Device Security' },
  { code: 'COMP-06', name: 'Software Updates' },
  { code: 'COMP-07', name: 'Data Backup' },
  { code: 'COMP-08', name: 'Cloud Storage Basics' },
  { code: 'COMP-09', name: 'Document Editing' },
  { code: 'COMP-10', name: 'Spreadsheets' },
  { code: 'COMP-11', name: 'Presentations' },
  { code: 'COMP-12', name: 'File Management' },
  { code: 'COMP-13', name: 'Networking Basics' },
  { code: 'COMP-14', name: 'Online Communication Etiquette' },
  { code: 'COMP-15', name: 'Video Conferencing' },
  { code: 'COMP-16', name: 'Digital Footprint' },
  { code: 'COMP-17', name: 'Privacy Settings' },
  { code: 'COMP-18', name: 'Social Media Safety' },
  { code: 'COMP-19', name: 'Cyber Hygiene' },
  { code: 'COMP-20', name: 'Mobile Security' },
  { code: 'COMP-21', name: 'Two‑Factor Authentication' },
  { code: 'COMP-22', name: 'Incident Reporting' },
];

async function run() {
  await connectDB();

  const ops = COMPETENCIES.map((c) => ({
    updateOne: {
      filter: { code: c.code },
      update: {
        $setOnInsert: {
          code: c.code,
          name: c.name,
          ...(c.description ? { description: c.description } : {}),
        },
      },
      upsert: true,
    },
  }));

  const res = await Competency.bulkWrite(ops, { ordered: false });

  const inserted = res.upsertedCount ?? 0;
  const matched = res.matchedCount ?? 0;
  console.log(
    `✅ Competencies seeding complete. Inserted: ${inserted}, matched existing: ${matched}`,
  );
  process.exit(0);
}

run().catch((e) => {
  console.error('Competencies seed failed:', e);
  process.exit(1);
});
