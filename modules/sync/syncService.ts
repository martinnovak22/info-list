import { ref, set, get, child, remove } from 'firebase/database';
import { database } from './firebaseConfig';
import { useStore } from '../core/store/store';
import { mergeItems, mergeNotes } from '../transfer/merge';
import { itemsToCsv } from '../transfer/csvItem';
import { notesToCsv } from '../transfer/csvNote';
import { csvToItems } from '../transfer/csvItem';
import { csvToNotes } from '../transfer/csvNote';
import { scheduleTaskNotification } from '../core/utils/notifications';

export const generateSyncCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const uploadSyncData = async (code: string): Promise<void> => {
    const { items, tags, notes } = useStore.getState();

    const itemsCsv = itemsToCsv(items, tags);
    const notesCsv = notesToCsv(notes);

    const payload = {
        itemsCsv,
        notesCsv,
        timestamp: Date.now(),
    };

    await set(ref(database, `sync/${code}`), payload);
};

export const downloadSyncData = async (code: string): Promise<{ itemsCreated: number, itemsUpdated: number, notesCreated: number, notesUpdated: number } | null> => {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `sync/${code}`));

    if (!snapshot.exists()) {
        return null;
    }

    const data = snapshot.val();
    const { itemsCsv, notesCsv } = data;

    let itemsCreated = 0;
    let itemsUpdated = 0;
    let notesCreated = 0;
    let notesUpdated = 0;

    if (itemsCsv) {
        const importedItems = csvToItems(itemsCsv);
        const { items, tags } = useStore.getState();
        const result = mergeItems(items, tags, importedItems);

        useStore.setState((state) => ({
            ...state,
            items: result.nextItems,
            tags: result.nextTags,
        }));

        // Schedule notifications for affected items
        result.affectedItems.forEach((item) => {
            if (item.dueDate && item.dueDate > Date.now()) {
                scheduleTaskNotification(item.id, item.text, item.dueDate);
            }
        });

        itemsCreated += result.created;
        itemsUpdated += result.updated;
    }

    if (notesCsv) {
        const importedNotes = csvToNotes(notesCsv);
        const { notes } = useStore.getState();
        const result = mergeNotes(notes, importedNotes);

        useStore.setState((state) => ({
            ...state,
            notes: result.nextNotes,
        }));

        // Schedule notifications for affected notes
        result.affectedNotes.forEach((note) => {
            if (note.dueDate && note.dueDate > Date.now()) {
                scheduleTaskNotification(note.id, note.title, note.dueDate);
            }
        });

        notesCreated += result.created;
        notesUpdated += result.updated;

    }

    // Optional: remove data after successful sync to prevent reuse?
    // User seemingly removed this, but we'll leave the comment.
    // await remove(child(dbRef, `sync/${code}`));

    return { itemsCreated, itemsUpdated, notesCreated, notesUpdated };
};
