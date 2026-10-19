import app from './app.js';
import config from './config/config.js';
import connectDB from './config/db.js';
import { startModelServer } from './services/mlService.js';
import { loadCityDataCache } from './services/cityDataService.js';

// Connect to Database and start background services for local development
connectDB().then(() => {
  startModelServer();
  loadCityDataCache();
}).catch((err) => {
  console.warn(`[Server Init Warning] Database initial connect: ${err.message}`);
});

const PORT = config.port;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running in ${config.env} mode on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});

// Gracefully handle port already in use
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error(`   Run: Get-Process node | Stop-Process -Force`);
    console.error(`   Then restart the server.\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});
