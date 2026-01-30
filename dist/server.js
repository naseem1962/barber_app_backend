"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const httpServer = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: [
            process.env.USER_WEB_URL || 'https://barber-user-webapp.vercel.app',
            process.env.BARBER_WEB_URL || 'https://barber-vendor-webapp.vercel.app',
            process.env.ADMIN_DASHBOARD_URL || 'https://barber-admin-ten.vercel.app',
        ],
        credentials: true,
    },
});
exports.io = io;
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI ||
    'mongodb+srv://zaeems629_db_user:wf8zsvCrwJu3qvu@cluster0.hlf38pl.mongodb.net/barber_app';
// Replace app's null io with real Socket.IO for local dev
app_1.default.set('io', io);
// Socket.IO for real-time chat (local only; not available on Vercel serverless)
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });
    socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room ${roomId}`);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// Connect to MongoDB and start server (local only)
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log('✅ Connected to MongoDB');
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
})
    .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
});
exports.default = app_1.default;
//# sourceMappingURL=server.js.map