"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
const env_1 = require("./env");
const jwt_1 = require("../utils/jwt");
const exam_socket_1 = require("../sockets/exam.socket");
let io;
function initSocket(server) {
    io = new socket_io_1.Server(server, {
        cors: { origin: env_1.env.CLIENT_URL, credentials: true },
    });
    // Lightweight auth middleware
    io.use((socket, next) => {
        try {
            const header = socket.handshake.headers.authorization ?? '';
            const bearer = (Array.isArray(header) ? header[0] : header) || '';
            const token = socket.handshake.auth?.token ||
                socket.handshake.query?.token ||
                bearer.split(' ')[1];
            if (!token)
                return next(new Error('Missing token'));
            const payload = (0, jwt_1.verifyAccessToken)(token);
            socket.data.user = payload;
            return next();
        }
        catch {
            return next(new Error('Unauthorized'));
        }
    });
    (0, exam_socket_1.registerExamSocketHandlers)(io);
    return io;
}
function getIO() {
    if (!io)
        throw new Error('Socket.io not initialized');
    return io;
}
