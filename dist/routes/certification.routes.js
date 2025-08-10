"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/certification.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const certification_controller_1 = require("../controllers/certification.controller");
const certification_validators_1 = require("../validators/certification.validators");
const router = (0, express_1.Router)();
// Public verify by certificateId
router.get('/verify/:certificateId', (0, validation_middleware_1.validate)({ params: certification_validators_1.VerifyPublicIdParams }), certification_controller_1.verifyCtrl);
// Authenticated
router.use(auth_middleware_1.requireAuth);
// Student: my cert
router.get('/me', (0, rbac_middleware_1.requireRole)('student'), certification_controller_1.meCtrl);
// Admin/Supervisor: read by _id
router.get('/:id', (0, rbac_middleware_1.requireRole)('admin', 'supervisor'), (0, validation_middleware_1.validate)({ params: certification_validators_1.CertIdParams }), certification_controller_1.getByIdCtrl);
// Admin or owner: download PDF
router.get('/:id/pdf', (0, validation_middleware_1.validate)({ params: certification_validators_1.CertIdParams }), certification_controller_1.pdfCtrl);
exports.default = router;
