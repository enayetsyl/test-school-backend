// src/routes/admin.users.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  listUsersCtrl,
  getUserCtrl,
  createUserCtrl,
  updateUserCtrl,
} from '../controllers/admin.users.controller';
import {
  ListUsersQuery,
  UserIdParams,
  CreateUserSchema,
  UpdateUserSchema,
} from '../validators/admin.users.validators';

const router = Router();
router.use(requireAuth, requireRole('admin'));

router.get('/', validate(ListUsersQuery), listUsersCtrl);
router.get('/:id', validate(UserIdParams), getUserCtrl);
router.post('/', validate(CreateUserSchema), createUserCtrl);
router.patch('/:id', validate({ ...UserIdParams, ...UpdateUserSchema }), updateUserCtrl);

export default router;
