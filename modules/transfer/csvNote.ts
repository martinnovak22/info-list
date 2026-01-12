import Papa from 'papaparse';
import type { Note } from '../core/store';
import { NOTES_COLUMNS } from './csvSchema';

type NoteCsvRow = {
    title: string;
    content: string;
    createdAt: string;
    dueDate: string;
};

export type ImportedNote = {
    title: string;
    content: string;
    createdAt: number;
    dueDate?: number;
};

const parseNumberOptional = (value: unknown): number | undefined => {
    const v = String(value ?? '').trim();
    if (v === '') return undefined;
    const n = Number(v);
    if (!Number.isFinite(n)) throw new Error(`Invalid number: ${v}`);
    return n;
};

const requireColumns = (row: Record<string, unknown>, cols: readonly string[], rowIndex: number): void => {
    for (const col of cols) {
        if (!(col in row)) {
            throw new Error(`Missing column "${col}" (row ${rowIndex + 2})`);
        }
    }
};

export const notesToCsv = (notes: Note[]): string => {
    const rows: NoteCsvRow[] = notes.map((n) => ({
        title: n.title,
        content: n.content,
        createdAt: String(n.createdAt),
        dueDate: n.dueDate !== undefined ? String(n.dueDate) : '',
    }));

    return Papa.unparse(rows, { columns: [...NOTES_COLUMNS], header: true, quotes: false });
};

export const csvToNotes = (csv: string): ImportedNote[] => {
    const parsed = Papa.parse<Record<string, unknown>>(csv, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim(),
    });

    if (parsed.errors?.length) {
        const first = parsed.errors[0];
        throw new Error(`CSV parse error: ${first.message}`);
    }

    const data = parsed.data ?? [];
    const result: ImportedNote[] = [];

    data.forEach((row, idx) => {
        requireColumns(row, NOTES_COLUMNS, idx);

        const title = String(row.title ?? '').trim();
        if (!title) throw new Error(`Missing "title" (row ${idx + 2})`);

        const content = String(row.content ?? '');
        const createdAt = parseNumberOptional(row.createdAt);
        if (createdAt === undefined) throw new Error(`Missing "createdAt" (row ${idx + 2})`);

        const dueDate = parseNumberOptional(row.dueDate);

        result.push({ title, content, createdAt, dueDate });
    });

    return result;
};
