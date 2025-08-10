"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAudit = logAudit;
const mongoose_1 = require("mongoose");
const AuditLog_1 = require("../models/AuditLog");
async function logAudit(actorId, action, target, meta) {
    await AuditLog_1.AuditLog.create({
        actorId: new mongoose_1.Types.ObjectId(actorId),
        action,
        target,
        meta,
    });
}
