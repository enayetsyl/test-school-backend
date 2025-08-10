"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/user.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/me', auth_middleware_1.requireAuth, (req, res) => {
    return res.ok({ user: req.user }, 'Current user');
});
exports.default = router;
