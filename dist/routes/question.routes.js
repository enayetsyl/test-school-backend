"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/question.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const question_controller_1 = require("../controllers/question.controller");
const question_validators_1 = require("../validators/question.validators");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth);
// CSV import/export (admin)
router.post('/import', (0, rbac_middleware_1.requireRole)('admin'), (0, validation_middleware_1.validate)({ query: question_validators_1.ImportQuery }), question_controller_1.importMulter, question_controller_1.importCsvCtrl);
router.get('/export', (0, rbac_middleware_1.requireRole)('admin'), question_controller_1.exportCsvCtrl);
// list/read (admin, supervisor)
router.get('/', (0, rbac_middleware_1.requireRole)('admin', 'supervisor', 'student'), (0, validation_middleware_1.validate)({ query: question_validators_1.ListQuestionQuery }), question_controller_1.listCtrl);
router.get('/:id', (0, rbac_middleware_1.requireRole)('admin', 'supervisor', 'student'), (0, validation_middleware_1.validate)({ params: question_validators_1.QuestionIdParams }), question_controller_1.getCtrl);
// create/update/delete (admin)
router.post('/', (0, rbac_middleware_1.requireRole)('admin'), (0, validation_middleware_1.validate)(question_validators_1.CreateQuestionSchema), question_controller_1.createCtrl);
router.patch('/:id', (0, rbac_middleware_1.requireRole)('admin'), (0, validation_middleware_1.validate)({ params: question_validators_1.QuestionIdParams, body: question_validators_1.UpdateQuestionSchema }), question_controller_1.updateCtrl);
router.delete('/:id', (0, rbac_middleware_1.requireRole)('admin'), (0, validation_middleware_1.validate)({ params: question_validators_1.QuestionIdParams }), question_controller_1.deleteCtrl);
exports.default = router;
