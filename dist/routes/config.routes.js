// src/routes/config.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { getSystemConfigCtrl, patchSystemConfigCtrl } from '../controllers/systemConfig.controller';
import { PatchSystemConfigSchema } from '../validators/systemConfig.validators';
const router = Router();
router.use(requireAuth, requireRole('admin'));
router.get('/', getSystemConfigCtrl);
router.patch('/', validate(PatchSystemConfigSchema), patchSystemConfigCtrl);
export default router;
