import type { Item, Note, Tag } from '../core/store/store';
import { normalizeKey } from './normalize';
import type { ImportedItem } from './csvItem';
import type { ImportedNote } from './csvNote';
import { theme } from '../core/constants/theme';

const defaultTagColor = theme.palette.green;

const ensureTags = (existingTags: Tag[], tagNames: string[]): { nextTags: Tag[]; tagNameToId: Map<string, string> } => {
    const byNormName = new Map(existingTags.map((t) => [normalizeKey(t.name), t]));
    const nextTags = [...existingTags];

    tagNames.forEach((name) => {
        const norm = normalizeKey(name);
        if (!byNormName.has(norm)) {
            const newTag: Tag = { id: Date.now().toString() + Math.random().toString(16).slice(2), name, color: defaultTagColor };
            nextTags.push(newTag);
            byNormName.set(norm, newTag);
        }
    });

    const tagNameToId = new Map<string, string>();
    nextTags.forEach((t) => tagNameToId.set(normalizeKey(t.name), t.id));

    return { nextTags, tagNameToId };
};

export const mergeItems = (
    existingItems: Item[],
    existingTags: Tag[],
    imported: ImportedItem[]
): { nextItems: Item[]; nextTags: Tag[]; created: number; updated: number; affectedItems: Item[] } => {
    const itemByKey = new Map(existingItems.map((i) => [normalizeKey(i.text), i]));
    let created = 0;
    let updated = 0;
    const affectedItems: Item[] = [];

    const allImportedTagNames = imported.flatMap((i) => i.tagNames);
    const { nextTags, tagNameToId } = ensureTags(existingTags, allImportedTagNames);

    const nextItems = [...existingItems];

    imported.forEach((imp) => {
        const key = normalizeKey(imp.text);
        const existing = itemByKey.get(key);

        const nextTagIds =
            imp.tagNames.length > 0
                ? imp.tagNames.map((n) => tagNameToId.get(normalizeKey(n))).filter((x): x is string => Boolean(x))
                : undefined;

        if (existing) {
            const merged: Item = {
                ...existing,
                completed: imp.completed,
                ...(imp.dueDate !== undefined ? { dueDate: imp.dueDate } : {}),
                ...(nextTagIds !== undefined ? { tagIds: nextTagIds } : {}),
            };

            const idx = nextItems.findIndex((x) => x.id === existing.id);
            if (idx >= 0) nextItems[idx] = merged;
            updated += 1;
            affectedItems.push(merged);
        } else {
            const newItem: Item = {
                id: Date.now().toString() + Math.random().toString(16).slice(2),
                text: imp.text,
                completed: imp.completed,
                createdAt: imp.createdAt,
                ...(imp.dueDate !== undefined ? { dueDate: imp.dueDate } : {}),
                tagIds: nextTagIds ?? [],
            };
            nextItems.push(newItem);
            itemByKey.set(key, newItem);
            created += 1;
            affectedItems.push(newItem);
        }
    });

    return { nextItems, nextTags, created, updated, affectedItems };
};

export const mergeNotes = (
    existingNotes: Note[],
    imported: ImportedNote[]
): { nextNotes: Note[]; created: number; updated: number; affectedNotes: Note[] } => {
    const noteByKey = new Map(existingNotes.map((n) => [normalizeKey(n.title), n]));
    let created = 0;
    let updated = 0;
    const affectedNotes: Note[] = [];

    const nextNotes = [...existingNotes];

    imported.forEach((imp) => {
        const key = normalizeKey(imp.title);
        const existing = noteByKey.get(key);

        if (existing) {
            const merged: Note = {
                ...existing,
                content: imp.content,
                ...(imp.dueDate !== undefined ? { dueDate: imp.dueDate } : {}),
            };

            const idx = nextNotes.findIndex((x) => x.id === existing.id);
            if (idx >= 0) nextNotes[idx] = merged;
            updated += 1;
            affectedNotes.push(merged);
        } else {
            const newNote: Note = {
                id: Date.now().toString() + Math.random().toString(16).slice(2),
                title: imp.title,
                content: imp.content,
                createdAt: imp.createdAt,
                ...(imp.dueDate !== undefined ? { dueDate: imp.dueDate } : {}),
            };
            nextNotes.push(newNote);
            noteByKey.set(key, newNote);
            created += 1;
            affectedNotes.push(newNote);
        }
    });

    return { nextNotes, created, updated, affectedNotes };
};
