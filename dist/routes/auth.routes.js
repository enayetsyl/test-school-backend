"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = require("express");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_validators_1 = require("../validators/auth.validators");
const auth_controller_1 = require("../controllers/auth.controller");
const rate_limit_1 = require("../middleware/rate-limit");
const router = (0, express_1.Router)();
router.post('/register', rate_limit_1.authLimiter, (0, validation_middleware_1.validate)(auth_validators_1.RegisterSchema), auth_controller_1.register);
router.post('/login', rate_limit_1.authLimiter, (0, validation_middleware_1.validate)(auth_validators_1.LoginSchema), auth_controller_1.login);
router.post('/token/refresh', rate_limit_1.authLimiter, (0, validation_middleware_1.validate)(auth_validators_1.RefreshSchema), auth_controller_1.refresh);
router.post('/logout', (0, validation_middleware_1.validate)(auth_validators_1.LogoutSchema), auth_controller_1.logout);
router.post('/otp/send', rate_limit_1.authLimiter, (0, validation_middleware_1.validate)(auth_validators_1.SendOtpSchema), auth_controller_1.sendOtpCtrl);
router.post('/otp/verify', rate_limit_1.authLimiter, (0, validation_middleware_1.validate)(auth_validators_1.VerifyOtpSchema), auth_controller_1.verifyOtpCtrl);
router.post('/otp/resend', rate_limit_1.authLimiter, (0, validation_middleware_1.validate)(auth_validators_1.SendOtpSchema), auth_controller_1.sendOtpCtrl);
router.post('/forgot', rate_limit_1.authLimiter, (0, validation_middleware_1.validate)(auth_validators_1.ForgotSchema), auth_controller_1.forgot);
router.post('/reset', rate_limit_1.authLimiter, (0, validation_middleware_1.validate)(auth_validators_1.ResetSchema), auth_controller_1.reset);
exports.default = router;
