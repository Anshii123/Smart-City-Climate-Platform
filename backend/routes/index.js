import express from 'express';
import healthRoutes from './health.js';

const router = express.Router();

// Mount api routes
router.use('/health', healthRoutes);

export default router;
