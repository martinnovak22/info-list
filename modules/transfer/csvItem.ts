import Papa from 'papaparse';
import type { Item, Tag } from "../core/store";
import { ITEMS_COLUMNS } from './csvSchema';

type ItemCsvRow = {
    text: string;
    completed: string;
    createdAt: string;
    dueDate: string;
    tags: string; // JSON array string
};

export type ImportedItem = {
    text: string;
    completed: boolean;
    createdAt: number;
    dueDate?: number;
    tagNames: string[];
};

const parseBoolean = (value: unknown): boolean => {
    const v = String(value ?? '').trim().toLowerCase();
    if (v === 'true') return true;
    if (v === 'false') return false;
    // tolerate 1/0
    if (v === '1') return true;
    if (v === '0') return false;
    throw new Error(`Invalid boolean: ${String(value)}`);
};

const parseNumberOptional = (value: unknown): number | undefined => {
    const v = String(value ?? '').trim();
    if (v === '') return undefined;
    const n = Number(v);
    if (!Number.isFinite(n)) throw new Error(`Invalid number: ${v}`);
    return n;
};

const parseTags = (value: unknown): string[] => {
    const raw = String(value ?? '').trim();
    if (raw === '') return [];
    // primary: JSON array of strings
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
            return parsed.map((t) => t.trim()).filter(Boolean);
        }
    } catch {
        // fallback below
    }
    // fallback: allow "A;B;C" or "A,B,C"
    return raw
        .split(/[;,]/g)
        .map((t) => t.trim())
        .filter(Boolean);
};

const requireColumns = (row: Record<string, unknown>, cols: readonly string[], rowIndex: number): void => {
    for (const col of cols) {
        if (!(col in row)) {
            throw new Error(`Missing column "${col}" (row ${rowIndex + 2})`);
        }
    }
};

export const itemsToCsv = (items: Item[], tags: Tag[]): string => {
    const tagById = new Map(tags.map((t) => [t.id, t.name]));

    const rows: ItemCsvRow[] = items.map((item) => {
        const tagNames = item.tagIds
            .map((id) => tagById.get(id))
            .filter((x): x is string => Boolean(x));

        return {
            text: item.text,
            completed: String(item.completed),
            createdAt: String(item.createdAt),
            dueDate: item.dueDate !== undefined ? String(item.dueDate) : '',
            tags: JSON.stringify(tagNames),
        };
    });

    return Papa.unparse(rows, { columns: [...ITEMS_COLUMNS], header: true, quotes: false });
};

export const csvToItems = (csv: string): ImportedItem[] => {
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
    const result: ImportedItem[] = [];

    data.forEach((row, idx) => {
        requireColumns(row, ITEMS_COLUMNS, idx);

        const text = String(row.text ?? '').trim();
        if (!text) throw new Error(`Missing "text" (row ${idx + 2})`);

        const completed = parseBoolean(row.completed);
        const createdAt = parseNumberOptional(row.createdAt);
        if (createdAt === undefined) throw new Error(`Missing "createdAt" (row ${idx + 2})`);

        const dueDate = parseNumberOptional(row.dueDate);
        const tagNames = parseTags(row.tags);

        result.push({
            text,
            completed,
            createdAt,
            dueDate,
            tagNames,
        });
    });

    return result;
};
