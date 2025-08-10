"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyPublicIdParams = exports.CertIdParams = exports.ObjectId = void 0;
// validators/certification.validators.ts
const zod_1 = require("zod");
exports.ObjectId = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');
exports.CertIdParams = zod_1.z.object({ id: exports.ObjectId });
exports.VerifyPublicIdParams = zod_1.z.object({
    certificateId: zod_1.z.string().min(10).max(100),
});
