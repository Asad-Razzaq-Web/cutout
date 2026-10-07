import 'dotenv/config';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'node:fs';
import { connectDB } from './config/db.js';
import { UPLOAD_DIR } from './config/paths.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import historyRoutes from './routes/history.routes.js';
import removeBgRoutes from './routes/removeBg.routes.js';
import trackRoutes from './routes/track.routes.js';
import { cleanGuestFiles } from './utils/files.js';

const app = express();
app.set('trust proxy', 1);

// Global Middlewares (CORS initialized before Helmet)
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(express.json({ limit: '100kb' }));

if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Local File Uploads Directory Initializer
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d', immutable: true }));

// Clean, resource-style endpoints
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/remove-bg', removeBgRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(port, () => console.log(`API listening on :${port}`));
    setInterval(() => cleanGuestFiles().catch(() => {}), 15 * 60 * 1000).unref();
  })
  .catch((err) => {
    console.error('Failed to start:', err.message);
    process.exit(1);
  });
