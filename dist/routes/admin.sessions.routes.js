"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin.sessions.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const admin_sessions_controller_1 = require("../controllers/admin.sessions.controller");
const admin_sessions_validators_1 = require("../validators/admin.sessions.validators");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, (0, rbac_middleware_1.requireRole)('admin', 'supervisor'));
router.get('/', (0, validation_middleware_1.validate)(admin_sessions_validators_1.ListSessionsQuery), admin_sessions_controller_1.listSessionsCtrl);
router.get('/:id', (0, validation_middleware_1.validate)(admin_sessions_validators_1.SessionIdParams), admin_sessions_controller_1.getSessionCtrl);
exports.default = router;
