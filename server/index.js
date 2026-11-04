import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import publicRoutes from './routes/public.js';
import ticketRoutes from './routes/tickets.js';
import adminRoutes from './routes/admin.js';
import { localStore } from './config/localStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables reliably from workspace root .env
dotenv.config({ path: path.resolve(rootDir, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Security and CORS
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible media, fonts, and PayHere redirection
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: true,
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Uploads Directory
const uploadDir = path.resolve(rootDir, 'public/uploads');
app.use('/uploads', express.static(uploadDir));

// API Routes Mount
app.use('/api', publicRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Battle of the Maroons Official Backend API',
    timestamp: new Date().toISOString()
  });
});

// Production Static Serving
if (process.env.NODE_ENV === 'production') {
  const distDir = path.resolve(rootDir, 'dist');
  app.use(express.static(distDir));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distDir, 'index.html'));
  });
}

// Start Server & Connect MongoDB
async function startServer() {
  localStore.getStore();
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
🏏 ======================================================== 🏏
   BATTLE OF THE MAROONS — BACKEND SERVER & API RUNNING
   Port: http://localhost:${PORT}
   API Health: http://localhost:${PORT}/api/health
   Admin Auth: http://localhost:${PORT}/api/admin/auth/login
🏏 ======================================================== 🏏
    `);
  });
}

startServer();
