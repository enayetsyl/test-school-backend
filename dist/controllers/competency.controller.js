"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCtrl = exports.updateCtrl = exports.getCtrl = exports.createCtrl = exports.listCtrl = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const audit_service_1 = require("../services/audit.service");
const competency_service_1 = require("../services/competency.service");
exports.listCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    console.log('controller', req.query);
    const opts = {
        ...(req.query.page ? { page: Number(req.query.page) } : {}),
        ...(req.query.limit ? { limit: Number(req.query.limit) } : {}),
        ...(req.query.q ? { q: String(req.query.q) } : {}),
        ...(req.query.sortBy ? { sortBy: req.query.sortBy } : {}),
        ...(req.query.sortOrder ? { sortOrder: req.query.sortOrder } : {}),
    };
    const { items, meta } = await (0, competency_service_1.listCompetencies)(opts);
    return res.paginated(items, meta);
});
exports.createCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const doc = await (0, competency_service_1.createCompetency)(req.body);
    await (0, audit_service_1.logAudit)(req.user.sub, 'COMPETENCY_CREATE', {
        type: 'Competency',
        id: doc._id.toString(),
    });
    return res.created({ competency: doc }, 'Competency created');
});
exports.getCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params; // validated by your params schema
    const c = await (0, competency_service_1.getCompetency)(id);
    return res.ok({ competency: c });
});
exports.updateCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const c = await (0, competency_service_1.updateCompetency)(id, req.body);
    await (0, audit_service_1.logAudit)(req.user.sub, 'COMPETENCY_UPDATE', { type: 'Competency', id: c._id.toString() }, { patch: req.body });
    return res.ok({ competency: c }, 'Updated');
});
exports.deleteCtrl = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    console.log('comp id', id);
    const deleted = await (0, competency_service_1.deleteCompetency)(id);
    await (0, audit_service_1.logAudit)(req.user.sub, 'COMPETENCY_DELETE', { type: 'Competency', id });
    return res.ok({ competency: deleted }, 'Competency deleted');
});
