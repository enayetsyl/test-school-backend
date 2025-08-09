// src/routes/user.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', requireAuth, (req, res) => {
  return res.ok({ user: req.user }, 'Current user');
});

export default router;
