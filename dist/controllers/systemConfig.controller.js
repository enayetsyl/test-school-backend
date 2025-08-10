"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemConfigCtrl = getSystemConfigCtrl;
exports.patchSystemConfigCtrl = patchSystemConfigCtrl;
const SystemConfig_1 = require("../models/SystemConfig");
async function getSystemConfigCtrl(_req, res) {
    const cfg = await (0, SystemConfig_1.loadSystemConfig)();
    return res.json({ success: true, data: cfg });
}
async function patchSystemConfigCtrl(req, res) {
    // Only set the fields provided (respect exactOptionalPropertyTypes)
    const $set = {};
    for (const k of ['timePerQuestionSec', 'retakeLockMinutes', 'maxRetakes', 'sebMode']) {
        if (k in req.body)
            $set[k] = req.body[k];
    }
    const updated = await SystemConfig_1.SystemConfig.findByIdAndUpdate('singleton', { $set }, { new: true, upsert: true });
    return res.json({ success: true, message: 'Config updated', data: updated });
}
