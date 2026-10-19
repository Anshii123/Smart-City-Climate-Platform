import mongoose from 'mongoose';
import config from './config.js';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    const mongoUri = config.mongoUri;
    if (!mongoUri) {
      console.warn('\n⚠️ [MongoDB] MONGO_URI is not set in backend/.env!');
      console.warn('   Please create backend/.env with your MongoDB Atlas connection string:');
      console.warn('   MONGO_URI=mongodb+srv://<user>:<password>@cluster0.../smart_city_climate?retryWrites=true&w=majority\n');
      throw new Error('MONGO_URI is not set in backend/.env file');
    }

    cached.promise = mongoose.connect(mongoUri, opts).then((m) => {
      console.log(`[MongoDB] Connected: ${m.connection.host}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error(`[MongoDB] Connection Error: ${e.message}`);
    throw e;
  }

  return cached.conn;
};

export default connectDB;
