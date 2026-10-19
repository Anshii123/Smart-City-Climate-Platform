import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/config.js';
import connectDB from './config/db.js';
import requestLogger from './middleware/requestLogger.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use(requestLogger);

// Database connection middleware for Serverless & Warm instances
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    // Database connection not available: enable development in-memory fallback
    req.dbError = err.message;
  }
  next();
});

// API Routes - mounted at both /api and root to support Vercel rewrites seamlessly
app.use('/api', apiRouter);
app.use(apiRouter);

// Root path response for usability and status confirmation
const rootHandler = (req, res) => {
  res.json({
    status: 'online',
    message: 'Welcome to the Smart City Climate Platform API',
    environment: config.env,
    serverless: !!process.env.VERCEL,
    endpoints: {
      health: '/api/health',
      auth: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        me: '/api/auth/me'
      },
      uploads: '/api/uploads',
      climate: {
        analyze: '/api/climate/analyze'
      },
      predict: '/api/predict',
      cityData: '/api/city-data',
      predictions: '/api/predictions',
      rankings: '/api/rankings',
      heatmap: '/api/heatmap',
      analytics: '/api/analytics'
    }
  });
};

app.get('/', rootHandler);
app.get('/api', rootHandler);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
