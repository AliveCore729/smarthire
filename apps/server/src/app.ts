import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import authRoutes from './modules/auth/auth.routes.js';
import protectedRoutes from './modules/auth/auth.protected.js';
import resumeRoutes from './modules/resume/resume.routes.js';

import { errorMiddleware } from './common/middlewares/error.middleware.js';

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(compression());

app.use(hpp());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'SmartHire AI API healthy',
  });
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/protected', protectedRoutes);
app.use('/api/v1/resume', resumeRoutes);

app.use(errorMiddleware);

export default app;