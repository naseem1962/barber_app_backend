import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.USER_WEB_URL || 'https://barber-user-webapp.vercel.app',
      process.env.BARBER_WEB_URL || 'https://barber-vendor-webapp.vercel.app',
      process.env.ADMIN_DASHBOARD_URL || 'https://barber-admin-ten.vercel.app',
    ],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://zaeems629_db_user:wf8zsvCrwJu3qvu@cluster0.hlf38pl.mongodb.net/barber_app';

// Replace app's null io with real Socket.IO for local dev
app.set('io', io);

// Socket.IO for real-time chat (local only; not available on Vercel serverless)
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('leave-room', (roomId: string) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB and start server (local only)
mongoose
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

export { io };
export default app;
