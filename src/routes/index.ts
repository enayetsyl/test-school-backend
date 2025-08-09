// src/routes/index.ts
import { Router } from 'express';

import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import competencyRoutes from './competency.routes';
import questionRoutes from './question.routes';

const router = Router();

router.get('/health', (_req, res) => res.ok({ ok: true }));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/competencies', competencyRoutes);
router.use('/questions', questionRoutes);

export default router;
