import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
});
connectDB();
// Socket events setup can go here or in src/config/socket.ts
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
});
server.listen(env.PORT, () => {
    console.log(`Server running on env. ${env.PORT}`);
});
