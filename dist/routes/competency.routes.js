"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/competency.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const competency_controller_1 = require("../controllers/competency.controller");
const competency_validators_1 = require("../validators/competency.validators");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth);
// list (admin, supervisor)
router.get('/', (req, _res, next) => {
    console.log('RAW URL →', req.originalUrl); // should show ?q=...&page=... if sent
    next();
}, (0, rbac_middleware_1.requireRole)('admin', 'supervisor'), (0, validation_middleware_1.validate)({ query: competency_validators_1.ListCompetencyQuery }), competency_controller_1.listCtrl);
// create (admin)
router.post('/', (0, rbac_middleware_1.requireRole)('admin'), (0, validation_middleware_1.validate)(competency_validators_1.CreateCompetencySchema), competency_controller_1.createCtrl);
// get one (admin, supervisor)
router.get('/:id', (0, rbac_middleware_1.requireRole)('admin', 'supervisor'), (0, validation_middleware_1.validate)({ params: competency_validators_1.CompetencyIdParams }), competency_controller_1.getCtrl);
// update (admin)
router.patch('/:id', (0, rbac_middleware_1.requireRole)('admin'), (0, validation_middleware_1.validate)({ params: competency_validators_1.CompetencyIdParams, body: competency_validators_1.UpdateCompetencySchema }), competency_controller_1.updateCtrl);
// delete (admin)
router.delete('/:id', (0, rbac_middleware_1.requireRole)('admin'), (0, validation_middleware_1.validate)({ params: competency_validators_1.CompetencyIdParams }), competency_controller_1.deleteCtrl);
exports.default = router;
