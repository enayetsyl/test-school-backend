import { SystemConfig, loadSystemConfig } from '../models/SystemConfig';
export async function getSystemConfigCtrl(_req, res) {
    const cfg = await loadSystemConfig();
    return res.json({ success: true, data: cfg });
}
export async function patchSystemConfigCtrl(req, res) {
    // Only set the fields provided (respect exactOptionalPropertyTypes)
    const $set = {};
    for (const k of ['timePerQuestionSec', 'retakeLockMinutes', 'maxRetakes', 'sebMode']) {
        if (k in req.body)
            $set[k] = req.body[k];
    }
    const updated = await SystemConfig.findByIdAndUpdate('singleton', { $set }, { new: true, upsert: true });
    return res.json({ success: true, message: 'Config updated', data: updated });
}
