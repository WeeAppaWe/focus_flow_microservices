require('dotenv').config();
const http = require('http');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const sequelize = require('./config/database');
const app = require('./app');
const initScheduler = require('./cron/scheduler');

const PORT = process.env.TASK_PORT || 3002;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    },
});

// Store io in app for access in controllers
app.set('io', io);

// Socket.IO Authentication Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        return next(new Error('Authentication required'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (error) {
        return next(new Error('Invalid or expired token'));
    }
});

// Socket Connection Logic
io.on('connection', (socket) => {
    console.log('Authenticated client connected:', socket.id, '| User ID:', socket.userId);

    // Auto-join user to their personal room
    socket.join(`user_${socket.userId}`);
    console.log(`User ${socket.userId} auto-joined room user_${socket.userId}`);

    socket.on('join_room', (userId) => {
        if (userId !== socket.userId) {
            console.warn(`Security: User ${socket.userId} tried to join room of user ${userId}`);
            return;
        }
        socket.join(`user_${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start Server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        await sequelize.sync();
        console.log('Database models synced.');

        // Init Scheduler
        initScheduler(io);

        server.listen(PORT, () => {
            console.log(`Task Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
