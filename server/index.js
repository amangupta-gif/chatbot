import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import chatRoutes from './routes/chat.js';
import widgetRoutes from './routes/widget.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow widget embedding
  crossOriginEmbedderPolicy: false,
}));

// CORS - allow all origins for embeddable widget
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

// Serve widget files statically
app.use('/widget', express.static(path.join(__dirname, '../widget')));

// Rate limiting
app.use('/api', rateLimiter);

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/widget', widgetRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 ChatBot Server running on http://localhost:${PORT}`);
  console.log(`📡 Widget available at http://localhost:${PORT}/widget/widget.js`);
  console.log(`🔑 AI Provider: ${process.env.AI_PROVIDER || 'gemini'}\n`);
});

export default app;
