// src/routes/certification.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { meCtrl, getByIdCtrl, verifyCtrl, pdfCtrl } from '../controllers/certification.controller';
import { CertIdParams, VerifyPublicIdParams } from '../validators/certification.validators';
const router = Router();
// Public verify by certificateId
router.get('/verify/:certificateId', validate({ params: VerifyPublicIdParams }), verifyCtrl);
// Authenticated
router.use(requireAuth);
// Student: my cert
router.get('/me', requireRole('student'), meCtrl);
// Admin/Supervisor: read by _id
router.get('/:id', requireRole('admin', 'supervisor'), validate({ params: CertIdParams }), getByIdCtrl);
// Admin or owner: download PDF
router.get('/:id/pdf', validate({ params: CertIdParams }), pdfCtrl);
export default router;
