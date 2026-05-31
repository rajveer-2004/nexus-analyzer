import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import aiRouter from './routes/ai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const corsOptions = {
  origin: (origin, callback) => {
    // In production or Docker, origin could be undefined for same-origin requests
    if (!origin || origin === CLIENT_ORIGIN || process.env.NODE_ENV === 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Rate Limiter: 10 requests per minute per IP for Gemini briefs
const briefLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many compliance requests from this IP. Please try again after a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', briefLimiter, aiRouter);

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    const indexPath = path.join(publicPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(404).send('Zamp Nexus Analyzer Server Running. Frontend Assets Build Required.');
      }
    });
  } else {
    res.status(404).json({ error: 'Endpoint not found.' });
  }
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  🚀 ZAMP NEXUS ANALYZER BACKEND SERVER IS RUNNING`);
  console.log(`  🔊 Port: ${PORT}`);
  console.log(`  🌐 Client Origin Whitelist: ${CLIENT_ORIGIN}`);
  console.log(`  🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===================================================`);
});
