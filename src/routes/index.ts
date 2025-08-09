// src/routes/question.routes.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';

const router = Router();

router.get('/health', (_req, res) => res.ok({ ok: true }));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
