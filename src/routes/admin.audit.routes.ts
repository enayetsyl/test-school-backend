import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { listAuditLogsCtrl } from '../controllers/admin.audit.controller';
import { ListAuditQuery } from '../validators/admin.audit.validators';

const router = Router();
router.use(requireAuth, requireRole('admin', 'supervisor'));

router.get('/', validate(ListAuditQuery), listAuditLogsCtrl);

export default router;
