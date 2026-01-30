import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import routes
import userRoutes from './routes/user.routes';
import barberRoutes from './routes/barber.routes';
import adminRoutes from './routes/admin.routes';
import appointmentRoutes from './routes/appointment.routes';
import chatRoutes from './routes/chat.routes';
import aiRoutes from './routes/ai.routes';
import contentRoutes from './routes/content.routes';

// Import middleware
import { errorHandler } from './middleware/errorHandler.middleware';
import { notFound } from './middleware/notFound.middleware';

dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.USER_WEB_URL || 'http://localhost:3000',
      process.env.BARBER_WEB_URL || 'http://localhost:4200',
      process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3001',
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// On Vercel, the serverless function is mounted at /api, so paths are /api/health, /api/users, etc.
// Rewrite req.url so Express routes (e.g. /health, /api/users) still match.
app.use((req: Request, _res: Response, next) => {
  if (req.path.startsWith('/api')) {
    const rest = req.path.length > 4 ? req.path.slice(4) : '/';
    const query = req.url.includes('?') ? '?' + req.url.split('?').slice(1).join('?') : '';
    (req as any).url = rest + query;
  }
  next();
});

// Health check & server status (GET)
app.get('/health', (_req: Request, res: Response) => {
  const port = process.env.PORT || 5000;
  res.status(200).json({
    status: 'OK',
    message: `Server is running on port ${port}`,
    port: Number(port),
  });
});

app.get('/api/server', (_req: Request, res: Response) => {
  const port = process.env.PORT || 5000;
  res.status(200).json({
    status: 'OK',
    message: `Server is running on port ${port}`,
    port: Number(port),
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/content', contentRoutes);

// No Socket.IO on Vercel - chat controller checks req.app.get('io') before emitting
app.set('io', null);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
