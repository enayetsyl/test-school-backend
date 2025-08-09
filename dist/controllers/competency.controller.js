import { asyncHandler } from '../utils/asyncHandler';
import { logAudit } from '../services/audit.service';
import { listCompetencies, createCompetency, getCompetency, updateCompetency, deleteCompetency, } from '../services/competency.service';
export const listCtrl = asyncHandler(async (req, res) => {
    console.log('controller', req.query);
    const opts = {
        ...(req.query.page ? { page: Number(req.query.page) } : {}),
        ...(req.query.limit ? { limit: Number(req.query.limit) } : {}),
        ...(req.query.q ? { q: String(req.query.q) } : {}),
        ...(req.query.sortBy ? { sortBy: req.query.sortBy } : {}),
        ...(req.query.sortOrder ? { sortOrder: req.query.sortOrder } : {}),
    };
    const { items, meta } = await listCompetencies(opts);
    return res.paginated(items, meta);
});
export const createCtrl = asyncHandler(async (req, res) => {
    const doc = await createCompetency(req.body);
    await logAudit(req.user.sub, 'COMPETENCY_CREATE', {
        type: 'Competency',
        id: doc._id.toString(),
    });
    return res.created({ competency: doc }, 'Competency created');
});
export const getCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params; // validated by your params schema
    const c = await getCompetency(id);
    return res.ok({ competency: c });
});
export const updateCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const c = await updateCompetency(id, req.body);
    await logAudit(req.user.sub, 'COMPETENCY_UPDATE', { type: 'Competency', id: c._id.toString() }, { patch: req.body });
    return res.ok({ competency: c }, 'Updated');
});
export const deleteCtrl = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log('comp id', id);
    const deleted = await deleteCompetency(id);
    await logAudit(req.user.sub, 'COMPETENCY_DELETE', { type: 'Competency', id });
    return res.ok({ competency: deleted }, 'Competency deleted');
});
