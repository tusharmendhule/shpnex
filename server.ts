import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/config/db.js';
import apiRouter from './server/routes/api.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to DB (will gracefully fall back to local in-memory DB if URI not present)
  await connectDB();

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors({
    origin: true,
    credentials: true
  }));

  // Mount API router
  app.use('/api', apiRouter);

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔄 [Server] Mounting Vite developer server in middleware mode...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('📦 [Server] Serving compiled production assets...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [Server] ShpNex running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('❌ [Server] Failed to start ShpNex server:', err);
});
