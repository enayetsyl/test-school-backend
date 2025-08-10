"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const autoSubmitExpiredExams_job_1 = require("./jobs/autoSubmitExpiredExams.job");
const cleanupOldVideos_job_1 = require("./jobs/cleanupOldVideos.job");
const socket_1 = require("./config/socket");
const server = http_1.default.createServer(app_1.default);
(0, socket_1.initSocket)(server);
(0, db_1.connectDB)();
(0, autoSubmitExpiredExams_job_1.scheduleAutoSubmitExpiredExamsJob)();
(0, cleanupOldVideos_job_1.scheduleCleanupOldVideosJob)(2);
server.listen(env_1.env.PORT, () => {
    console.log(`Server running on env. ${env_1.env.PORT}`);
});
