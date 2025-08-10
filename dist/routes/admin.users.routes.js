"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/admin.users.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const admin_users_controller_1 = require("../controllers/admin.users.controller");
const admin_users_validators_1 = require("../validators/admin.users.validators");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, (0, rbac_middleware_1.requireRole)('admin'));
router.get('/', (0, validation_middleware_1.validate)(admin_users_validators_1.ListUsersQuery), admin_users_controller_1.listUsersCtrl);
router.get('/:id', (0, validation_middleware_1.validate)(admin_users_validators_1.UserIdParams), admin_users_controller_1.getUserCtrl);
router.post('/', (0, validation_middleware_1.validate)(admin_users_validators_1.CreateUserSchema), admin_users_controller_1.createUserCtrl);
router.patch('/:id', (0, validation_middleware_1.validate)({ ...admin_users_validators_1.UserIdParams, ...admin_users_validators_1.UpdateUserSchema }), admin_users_controller_1.updateUserCtrl);
exports.default = router;
