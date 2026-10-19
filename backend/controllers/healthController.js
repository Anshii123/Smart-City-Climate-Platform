import mongoose from 'mongoose';

export const getHealth = (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    const healthInfo = {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      serverless: !!process.env.VERCEL,
      services: {
        database: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
        mlService: 'OPERATIONAL'
      }
    };
    
    res.status(200).json(healthInfo);
  } catch (error) {
    next(error);
  }
};
