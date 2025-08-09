import { Server as SocketIOServer } from 'socket.io';
import { env } from './env';
import { verifyAccessToken } from '../utils/jwt';
import { registerExamSocketHandlers } from '../sockets/exam.socket';
let io;
export function initSocket(server) {
    io = new SocketIOServer(server, {
        cors: { origin: env.CLIENT_URL, credentials: true },
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
            const payload = verifyAccessToken(token);
            socket.data.user = payload;
            return next();
        }
        catch {
            return next(new Error('Unauthorized'));
        }
    });
    registerExamSocketHandlers(io);
    return io;
}
export function getIO() {
    if (!io)
        throw new Error('Socket.io not initialized');
    return io;
}
