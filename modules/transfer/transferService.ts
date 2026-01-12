import { useStore } from '../core/store/store';
import { exportCsvFile, pickCsvAndRead } from './fileIO';
import { itemsToCsv, csvToItems } from './csvItem';
import { notesToCsv, csvToNotes } from './csvNote';
import { mergeItems, mergeNotes } from './merge';

export const exportItemsCsv = async (): Promise<void> => {
    const { items, tags } = useStore.getState();
    const csv = itemsToCsv(items, tags);
    await exportCsvFile('items.csv', csv);
};

export const exportNotesCsv = async (): Promise<void> => {
    const { notes } = useStore.getState();
    const csv = notesToCsv(notes);
    await exportCsvFile('notes.csv', csv);
};

export const importItemsCsv = async (): Promise<{ created: number; updated: number } | null> => {
    const picked = await pickCsvAndRead();
    if (!picked) return null;

    const imported = csvToItems(picked.content);

    const { items, tags } = useStore.getState();
    const merged = mergeItems(items, tags, imported);

    useStore.setState((state) => ({
        ...state,
        items: merged.nextItems,
        tags: merged.nextTags,
    }));

    return { created: merged.created, updated: merged.updated };
};

export const importNotesCsv = async (): Promise<{ created: number; updated: number } | null> => {
    const picked = await pickCsvAndRead();
    if (!picked) return null;

    const imported = csvToNotes(picked.content);

    const { notes } = useStore.getState();
    const merged = mergeNotes(notes, imported);

    useStore.setState((state) => ({
        ...state,
        notes: merged.nextNotes,
    }));

    return { created: merged.created, updated: merged.updated };
};
