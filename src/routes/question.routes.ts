// src/routes/question.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  listCtrl,
  getCtrl,
  createCtrl,
  updateCtrl,
  deleteCtrl,
  importCsvCtrl,
  exportCsvCtrl,
  importMulter,
} from '../controllers/question.controller';
import {
  CreateQuestionSchema,
  UpdateQuestionSchema,
  ListQuestionQuery,
  QuestionIdParams,
  ImportQuery,
} from '../validators/question.validators';

const router = Router();

router.use(requireAuth);

// CSV import/export (admin)
router.post(
  '/import',
  requireRole('admin'),
  validate({ query: ImportQuery }),
  importMulter,
  importCsvCtrl,
);
router.get('/export', requireRole('admin'), exportCsvCtrl);

// list/read (admin, supervisor)
router.get(
  '/',
  requireRole('admin', 'supervisor', 'student'),
  validate({ query: ListQuestionQuery }),
  listCtrl,
);
router.get(
  '/:id',
  requireRole('admin', 'supervisor', 'student'),
  validate({ params: QuestionIdParams }),
  getCtrl,
);

// create/update/delete (admin)
router.post('/', requireRole('admin'), validate(CreateQuestionSchema), createCtrl);
router.patch(
  '/:id',
  requireRole('admin'),
  validate({ params: QuestionIdParams, body: UpdateQuestionSchema }),
  updateCtrl,
);
router.delete('/:id', requireRole('admin'), validate({ params: QuestionIdParams }), deleteCtrl);

export default router;
