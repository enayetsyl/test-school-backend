// src/routes/competency.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { createCtrl, deleteCtrl, getCtrl, listCtrl, updateCtrl, } from '../controllers/competency.controller';
import { CreateCompetencySchema, UpdateCompetencySchema, ListCompetencyQuery, CompetencyIdParams, } from '../validators/competency.validators';
const router = Router();
router.use(requireAuth);
// list (admin, supervisor)
router.get('/', (req, _res, next) => {
    console.log('RAW URL →', req.originalUrl); // should show ?q=...&page=... if sent
    next();
}, requireRole('admin', 'supervisor'), validate({ query: ListCompetencyQuery }), listCtrl);
// create (admin)
router.post('/', requireRole('admin'), validate(CreateCompetencySchema), createCtrl);
// get one (admin, supervisor)
router.get('/:id', requireRole('admin', 'supervisor'), validate({ params: CompetencyIdParams }), getCtrl);
// update (admin)
router.patch('/:id', requireRole('admin'), validate({ params: CompetencyIdParams, body: UpdateCompetencySchema }), updateCtrl);
// delete (admin)
router.delete('/:id', requireRole('admin'), validate({ params: CompetencyIdParams }), deleteCtrl);
export default router;
