// src/routes/exam.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validation.middleware';
import { requireSebHeaders } from '../middleware/seb.middleware';
import { StartExamQuery, StartExamBody, AnswerBody, SubmitBody, ViolationBody, SessionIdParams, UploadChunkQuery, } from '../validators/exam.validators';
import { startCtrl, answerCtrl, submitCtrl, statusCtrl, violationCtrl, } from '../controllers/exam.controller';
import { chunkUploadMulter, uploadChunkCtrl } from '../controllers/video.controller';
const router = Router();
router.use(requireAuth);
router.use(requireRole('student'));
// Start (step comes in query). Enforce SEB guard here.
router.post('/start', requireSebHeaders, validate({ query: StartExamQuery, body: StartExamBody }), startCtrl);
// Answer within time window
router.post('/answer', requireSebHeaders, validate(AnswerBody), answerCtrl);
// Submit
router.post('/submit', requireSebHeaders, validate(SubmitBody), submitCtrl);
// Status
router.get('/status/:sessionId', validate({ params: SessionIdParams }), statusCtrl);
// Violations (allow even if SEB warn mode)
router.post('/violation', validate(ViolationBody), violationCtrl);
router.post('/video/upload-chunk', validate({ query: UploadChunkQuery }), chunkUploadMulter, uploadChunkCtrl);
export default router;
