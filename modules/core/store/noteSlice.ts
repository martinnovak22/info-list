import { StateCreator } from 'zustand';

export type Note = {
    id: string;
    title: string;
    content: string;
    createdAt: number;
    dueDate?: number;
};

export interface NoteSlice {
    notes: Note[];
    addNote: (title: string, content: string, dueDate?: number, id?: string) => void;
    updateNote: (id: string, title: string, content: string, dueDate?: number) => void;
    deleteNote: (id: string) => void;
}

export const createNoteSlice: StateCreator<NoteSlice> = (set) => ({
    notes: [],
    addNote: (title, content, dueDate, id) =>
        set((state) => ({
            notes: [
                ...state.notes,
                { id: id || Date.now().toString(), title, content, createdAt: Date.now(), dueDate },
            ],
        })),
    updateNote: (id, title, content, dueDate) =>
        set((state) => ({
            notes: state.notes.map((n) =>
                n.id === id ? { ...n, title, content, ...(dueDate !== undefined && { dueDate }) } : n
            ),
        })),
    deleteNote: (id) =>
        set((state) => ({
            notes: state.notes.filter((n) => n.id !== id),
        })),
});
