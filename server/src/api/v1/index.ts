import { Router } from 'express';
import authRoutes from './auth/index';
import usersRoutes from './users/index';

const router = Router();

// Mount API routes
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

export default router;
