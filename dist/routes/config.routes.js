"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/config.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const systemConfig_controller_1 = require("../controllers/systemConfig.controller");
const systemConfig_validators_1 = require("../validators/systemConfig.validators");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, (0, rbac_middleware_1.requireRole)('admin'));
router.get('/', systemConfig_controller_1.getSystemConfigCtrl);
router.patch('/', (0, validation_middleware_1.validate)(systemConfig_validators_1.PatchSystemConfigSchema), systemConfig_controller_1.patchSystemConfigCtrl);
exports.default = router;
