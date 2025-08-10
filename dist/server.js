import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { scheduleAutoSubmitExpiredExamsJob } from './jobs/autoSubmitExpiredExams.job';
import { scheduleCleanupOldVideosJob } from './jobs/cleanupOldVideos.job';
import { initSocket } from './config/socket';
const server = http.createServer(app);
initSocket(server);
connectDB();
scheduleAutoSubmitExpiredExamsJob();
scheduleCleanupOldVideosJob(2);
server.listen(env.PORT, () => {
    console.log(`Server running on env. ${env.PORT}`);
});
