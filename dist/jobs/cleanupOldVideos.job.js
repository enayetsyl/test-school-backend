"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleCleanupOldVideosJob = scheduleCleanupOldVideosJob;
// src/jobs/cleanupOldVideos.job.ts
const node_cron_1 = __importDefault(require("node-cron"));
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const env_1 = require("../config/env");
/**
 * Deletes session video directories older than a threshold.
 * Run daily at 02:30 AM.
 */
function scheduleCleanupOldVideosJob(days = 2) {
    node_cron_1.default.schedule('30 2 * * *', async () => {
        const base = env_1.env.VIDEO_DIR;
        try {
            const exists = await fs_extra_1.default.pathExists(base);
            if (!exists)
                return;
            const entries = await fs_extra_1.default.readdir(base);
            const now = Date.now();
            const cutoff = days * 24 * 60 * 60 * 1000;
            for (const e of entries) {
                const full = node_path_1.default.join(base, e);
                try {
                    const stat = await fs_extra_1.default.stat(full);
                    // If it's a directory and old enough, remove
                    if (stat.isDirectory() && now - stat.mtimeMs > cutoff) {
                        await fs_extra_1.default.remove(full);
                    }
                }
                catch {
                    // ignore issues for individual entries
                }
            }
        }
        catch (err) {
            console.error('Video cleanup job error:', err);
        }
    });
}
