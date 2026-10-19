import mongoose from 'mongoose';
import config from './config.js';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, localServer: null };
}

// Function to start embedded local MongoDB instance for seamless local dev
async function startLocalMongo() {
  if (cached.localServer) {
    return cached.localServer.getUri() + 'smart_city_climate';
  }
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const server = await MongoMemoryServer.create();
  cached.localServer = server;
  const uri = server.getUri() + 'smart_city_climate';
  return uri;
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.promise) {
    return cached.promise;
  }

  const connectWithFallback = async () => {
    const mongoUri = config.mongoUri;
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
    };

    // 1. Try remote MongoDB URI (e.g. Atlas) first if configured
    if (mongoUri && !mongoUri.includes('localhost') && !mongoUri.includes('127.0.0.1')) {
      try {
        const m = await mongoose.connect(mongoUri, opts);
        console.log(`[MongoDB] Connected to remote database: ${m.connection.host}`);
        return m;
      } catch (err) {
        console.warn(`[MongoDB Warning] Remote Atlas connection failed: ${err.message}`);
        console.warn(`[MongoDB Info] Falling back to local embedded MongoDB engine for seamless development.`);
      }
    } else if (mongoUri && (mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1'))) {
      try {
        const m = await mongoose.connect(mongoUri, opts);
        console.log(`[MongoDB] Connected to local MongoDB: ${m.connection.host}`);
        return m;
      } catch (err) {
        console.warn(`[MongoDB Warning] Local MongoDB service not reachable: ${err.message}`);
      }
    }

    // 2. In Vercel serverless environment, rethrow error
    if (process.env.VERCEL) {
      throw new Error('Database connection failed in serverless environment.');
    }

    // 3. In local development, launch embedded MongoDB engine
    try {
      console.log('[MongoDB] Starting embedded local MongoDB server...');
      const localUri = await startLocalMongo();
      const m = await mongoose.connect(localUri, {
        bufferCommands: false,
      });
      console.log(`[MongoDB] Connected to embedded local database successfully! (${localUri})`);
      return m;
    } catch (localErr) {
      console.error(`[MongoDB Error] Failed to start local embedded database: ${localErr.message}`);
      throw localErr;
    }
  };

  cached.promise = connectWithFallback()
    .then((m) => {
      cached.conn = m;
      return m;
    })
    .catch((err) => {
      cached.promise = null;
      throw err;
    });

  return cached.promise;
};

export default connectDB;

