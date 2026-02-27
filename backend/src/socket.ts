// backend/src/socket.ts
import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer | null = null;

import { createAdapter } from '@socket.io/redis-adapter';
import redis from './config/redis';

export const initSocket = (server: HttpServer, corsOptions: any) => {
    io = new SocketIOServer(server, {
        cors: corsOptions,
    });

    // Use Redis Adapter for horizontal scaling and external emitters
    const pubClient = redis.duplicate();
    const subClient = redis.duplicate();
    io.adapter(createAdapter(pubClient, subClient));

    io.on('connection', (socket) => {
        console.log(`🔌 Client connected to socket: ${socket.id}`);

        // Frontend will join a room named after their submission ID
        socket.on('join_submission', (submissionId: string) => {
            const room = `submission_${submissionId}`;
            socket.join(room);
            console.log(`📡 Socket ${socket.id} joined room ${room}`);
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Client disconnected from socket: ${socket.id}`);
        });
    });

    return io;
};

export const getSocketIO = () => {
    if (!io) {
        console.warn('Socket.io has not been initialized yet.');
    }
    return io;
};
