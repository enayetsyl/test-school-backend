"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/exam.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const seb_middleware_1 = require("../middleware/seb.middleware");
const exam_validators_1 = require("../validators/exam.validators");
const exam_controller_1 = require("../controllers/exam.controller");
const video_controller_1 = require("../controllers/video.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth);
router.use((0, rbac_middleware_1.requireRole)('student'));
// Start (step comes in query). Enforce SEB guard here.
router.post('/start', seb_middleware_1.requireSebHeaders, (0, validation_middleware_1.validate)({ query: exam_validators_1.StartExamQuery, body: exam_validators_1.StartExamBody }), exam_controller_1.startCtrl);
// Answer within time window
router.post('/answer', seb_middleware_1.requireSebHeaders, (0, validation_middleware_1.validate)(exam_validators_1.AnswerBody), exam_controller_1.answerCtrl);
// Submit
router.post('/submit', seb_middleware_1.requireSebHeaders, (0, validation_middleware_1.validate)(exam_validators_1.SubmitBody), exam_controller_1.submitCtrl);
router.get('/me/latest-result', exam_controller_1.latestResultCtrl);
// Status
router.get('/status/:sessionId', (0, validation_middleware_1.validate)({ params: exam_validators_1.SessionIdParams }), exam_controller_1.statusCtrl);
// Violations (allow even if SEB warn mode)
router.post('/violation', (0, validation_middleware_1.validate)(exam_validators_1.ViolationBody), exam_controller_1.violationCtrl);
router.post('/video/upload-chunk', (0, validation_middleware_1.validate)({ query: exam_validators_1.UploadChunkQuery }), video_controller_1.chunkUploadMulter, video_controller_1.uploadChunkCtrl);
exports.default = router;
