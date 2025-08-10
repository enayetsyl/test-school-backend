// src/config/socket.ts
import type http from 'node:http';
import { Server as SocketIOServer, type Socket } from 'socket.io';
import { env } from './env';
import { verifyAccessToken, type AccessTokenPayload } from '../utils/jwt';
import { registerExamSocketHandlers } from '../sockets/exam.socket';

let io: SocketIOServer | undefined;

export function initSocket(server: http.Server) {
  io = new SocketIOServer(server, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  // Lightweight auth middleware
  io.use((socket: Socket, next) => {
    try {
      const header = socket.handshake.headers.authorization ?? '';
      const bearer = (Array.isArray(header) ? header[0] : header) || '';
      const token =
        (socket.handshake.auth?.token as string) ||
        (socket.handshake.query?.token as string) ||
        bearer.split(' ')[1];

      if (!token) return next(new Error('Missing token'));
      const payload = verifyAccessToken(token);
      (socket.data as { user: AccessTokenPayload }).user = payload;
      return next();
    } catch {
      return next(new Error('Unauthorized'));
    }
  });

  registerExamSocketHandlers(io);
  return io;
}

export function getIO(): SocketIOServer {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}
