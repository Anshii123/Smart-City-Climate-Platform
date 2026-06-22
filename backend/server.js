import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/config.js';
import requestLogger from './middleware/requestLogger.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use(requestLogger);

// API Routes
app.use('/api', apiRouter);

// Root path response for usability
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Smart City Climate Platform API',
    endpoints: {
      health: '/api/health'
    }
  });
});

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
