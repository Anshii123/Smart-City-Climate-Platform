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

  if (cached.promise) {
    return cached.promise;
  }

  const mongoUri = config.mongoUri;
  if (!mongoUri) {
    const err = new Error('MONGO_URI is missing in backend/.env');
    console.error(`[MongoDB Error] ${err.message}`);
    throw err;
  }

  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  };

  cached.promise = mongoose.connect(mongoUri, opts)
    .then((m) => {
      console.log(`[MongoDB] Connected successfully to Atlas Cluster: ${m.connection.host}`);
      cached.conn = m;
      return m;
    })
    .catch((err) => {
      cached.promise = null;
      console.error(`\n❌ [MongoDB Atlas Connection Error]`);
      console.error(`   Error message: ${err.message}`);
      console.error(`   Target URI: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);
      if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
        console.error(`\n   👉 Root cause: MongoDB Atlas rejected the username or password.`);
        console.error(`   👉 Fix in 1 minute:`);
        console.error(`      1. Go to https://cloud.mongodb.com -> Login`);
        console.error(`      2. Under 'Security', click 'Database Access'`);
        console.error(`      3. Find 'anshigarg101209_db_user' -> Click 'Edit' -> 'Edit Password'`);
        console.error(`      4. Set a new password and click 'Update User'`);
        console.error(`      5. Update the new password in backend/.env -> MONGO_URI\n`);
      }
      throw err;
    });

  return cached.promise;
};

export default connectDB;


