"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin.audit.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const admin_audit_controller_1 = require("../controllers/admin.audit.controller");
const admin_audit_validators_1 = require("../validators/admin.audit.validators");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, (0, rbac_middleware_1.requireRole)('admin', 'supervisor'));
router.get('/', (0, validation_middleware_1.validate)(admin_audit_validators_1.ListAuditQuery), admin_audit_controller_1.listAuditLogsCtrl);
exports.default = router;
