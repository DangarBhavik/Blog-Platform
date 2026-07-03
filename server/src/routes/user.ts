import express from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get("/me", authenticate, userController.me);

export default router;

