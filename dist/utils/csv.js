"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCsvBuffer = parseCsvBuffer;
exports.sendCsv = sendCsv;
// src/utils/csv.ts
const node_stream_1 = require("node:stream");
const parse_1 = require("@fast-csv/parse");
const format_1 = require("@fast-csv/format");
async function parseCsvBuffer(buffer) {
    return new Promise((resolve, reject) => {
        const rows = [];
        node_stream_1.Readable.from(buffer)
            .pipe((0, parse_1.parse)({
            headers: true,
            ignoreEmpty: true,
            trim: true,
        }))
            .on('error', reject)
            .on('data', (row) => rows.push(row))
            .on('end', () => resolve(rows));
    });
}
async function sendCsv(res, filename, rows) {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    const csv = (0, format_1.format)({ headers: true });
    csv.pipe(res);
    if (Symbol.asyncIterator in rows) {
        for await (const row of rows) {
            csv.write(row);
        }
    }
    else {
        for (const row of rows) {
            csv.write(row);
        }
    }
    csv.end();
}
