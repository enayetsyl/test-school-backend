// src/routes/admin.sessions.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { listSessionsCtrl, getSessionCtrl } from '../controllers/admin.sessions.controller';
import { ListSessionsQuery, SessionIdParams } from '../validators/admin.sessions.validators';

const router = Router();

router.use(requireAuth, requireRole('admin', 'supervisor'));

router.get('/', validate(ListSessionsQuery), listSessionsCtrl);
router.get('/:id', validate(SessionIdParams), getSessionCtrl);

export default router;
