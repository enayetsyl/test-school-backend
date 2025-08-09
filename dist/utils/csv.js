// src/utils/csv.ts
import { Readable } from 'node:stream';
import { parse } from '@fast-csv/parse';
import { format } from '@fast-csv/format';
export async function parseCsvBuffer(buffer) {
    return new Promise((resolve, reject) => {
        const rows = [];
        Readable.from(buffer)
            .pipe(parse({
            headers: true,
            ignoreEmpty: true,
            trim: true,
        }))
            .on('error', reject)
            .on('data', (row) => rows.push(row))
            .on('end', () => resolve(rows));
    });
}
export async function sendCsv(res, filename, rows) {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    const csv = format({ headers: true });
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
