"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOk = sendOk;
exports.sendCreated = sendCreated;
exports.sendNoContent = sendNoContent;
exports.sendPaginated = sendPaginated;
function sendOk(res, data, message, meta) {
    const body = {
        success: true,
        data,
        ...(message && { message }),
        ...(meta && { meta }),
    };
    return res.status(200).json(body);
}
function sendCreated(res, data, message, meta) {
    const body = {
        success: true,
        data,
        ...(message && { message }),
        ...(meta && { meta }),
    };
    return res.status(201).json(body);
}
function sendNoContent(res) {
    // Prefer true 204 with no body
    return res.status(204).end();
}
// Convenience for paginated lists
function sendPaginated(res, items, meta, message) {
    return sendOk(res, items, message, meta);
}
