import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables from backend/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  env: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_smart_city_climate_platform_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

export default config;
