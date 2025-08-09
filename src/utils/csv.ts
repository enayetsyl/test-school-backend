// src/utils/csv.ts
import { Readable } from 'node:stream';
import { parse, type RowMap } from '@fast-csv/parse';
import { format } from '@fast-csv/format';
import type { Response } from 'express';

export async function parseCsvBuffer<T = Record<string, string>>(buffer: Buffer): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    const rows: T[] = [];
    Readable.from(buffer)
      .pipe(
        parse<RowMap<string>, RowMap<string>>({
          headers: true,
          ignoreEmpty: true,
          trim: true,
        }),
      )
      .on('error', reject)
      .on('data', (row: T) => rows.push(row))
      .on('end', () => resolve(rows));
  });
}

export async function sendCsv(
  res: Response,
  filename: string,
  rows: AsyncIterable<Record<string, unknown>> | Array<Record<string, unknown>>,
) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const csv = format({ headers: true });
  csv.pipe(res);

  if (Symbol.asyncIterator in rows) {
    for await (const row of rows as AsyncIterable<Record<string, unknown>>) {
      csv.write(row);
    }
  } else {
    for (const row of rows as Array<Record<string, unknown>>) {
      csv.write(row);
    }
  }

  csv.end();
}
