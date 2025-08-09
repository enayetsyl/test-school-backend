// src/jobs/autoSubmitExpiredExams.job.ts
import cron from 'node-cron';
import { ExamSession } from '../models/ExamSession';
import { submitExam } from '../services/exam.service';
/** Runs every minute: auto-finalize expired "active" sessions. */
export function scheduleAutoSubmitExpiredExamsJob() {
    cron.schedule('*/1 * * * *', async () => {
        const now = new Date();
        const expired = await ExamSession.find({ status: 'active', deadlineAt: { $lt: now } }).select('_id userId');
        for (const s of expired) {
            try {
                await submitExam({ userId: String(s.userId), sessionId: String(s._id), reason: 'auto' });
            }
            catch (e) {
                // keep silent, next tick will retry new ones
                console.error('Auto-submit failed for session', String(s._id), e);
            }
        }
    });
}
