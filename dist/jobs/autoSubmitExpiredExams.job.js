"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleAutoSubmitExpiredExamsJob = scheduleAutoSubmitExpiredExamsJob;
// src/jobs/autoSubmitExpiredExams.job.ts
const node_cron_1 = __importDefault(require("node-cron"));
const ExamSession_1 = require("../models/ExamSession");
const exam_service_1 = require("../services/exam.service");
/** Runs every minute: auto-finalize expired "active" sessions. */
function scheduleAutoSubmitExpiredExamsJob() {
    node_cron_1.default.schedule('*/1 * * * *', async () => {
        const now = new Date();
        const expired = await ExamSession_1.ExamSession.find({ status: 'active', deadlineAt: { $lt: now } }).select('_id userId');
        for (const s of expired) {
            try {
                await (0, exam_service_1.submitExam)({ userId: String(s.userId), sessionId: String(s._id), reason: 'auto' });
            }
            catch (e) {
                // keep silent, next tick will retry new ones
                console.error('Auto-submit failed for session', String(s._id), e);
            }
        }
    });
}
