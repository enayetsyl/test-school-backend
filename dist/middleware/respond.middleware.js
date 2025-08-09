export function respondMiddleware(_req, res, next) {
    res.ok = function (data, message, meta) {
        return this.status(200).json({
            success: true,
            data,
            ...(message && { message }),
            ...(meta && { meta }),
        });
    };
    res.created = function (data, message, meta) {
        return this.status(201).json({
            success: true,
            data,
            ...(message && { message }),
            ...(meta && { meta }),
        });
    };
    res.noContent = function () {
        return this.status(204).end();
    };
    res.paginated = function (items, meta, message) {
        return this.status(200).json({ success: true, data: items, ...(message && { message }), meta });
    };
    next();
}
