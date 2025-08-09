// src/jobs/cleanupOldVideos.job.ts
import cron from 'node-cron';
import path from 'node:path';
import fs from 'fs-extra';
import { env } from '../config/env';

/**
 * Deletes session video directories older than a threshold.
 * Run daily at 02:30 AM.
 */
export function scheduleCleanupOldVideosJob(days = 2) {
  cron.schedule('30 2 * * *', async () => {
    const base = env.VIDEO_DIR;
    try {
      const exists = await fs.pathExists(base);
      if (!exists) return;

      const entries = await fs.readdir(base);
      const now = Date.now();
      const cutoff = days * 24 * 60 * 60 * 1000;

      for (const e of entries) {
        const full = path.join(base, e);
        try {
          const stat = await fs.stat(full);
          // If it's a directory and old enough, remove
          if (stat.isDirectory() && now - stat.mtimeMs > cutoff) {
            await fs.remove(full);
          }
        } catch {
          // ignore issues for individual entries
        }
      }
    } catch (err) {
      console.error('Video cleanup job error:', err);
    }
  });
}
