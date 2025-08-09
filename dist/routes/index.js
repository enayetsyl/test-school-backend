// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import competencyRoutes from './competency.routes';
import questionRoutes from './question.routes';
import examRoutes from './exam.routes';
import certificationRoutes from './certification.routes';
const router = Router();
router.get('/health', (_req, res) => res.ok({ ok: true }));
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/competencies', competencyRoutes);
router.use('/questions', questionRoutes);
router.use('/exam', examRoutes);
router.use('/certifications', certificationRoutes);
export default router;
