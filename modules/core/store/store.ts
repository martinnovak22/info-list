import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Tag = {
    id: string;
    name: string;
    color: string;
};

export type Item = {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
    completedAt?: number;
    dueDate?: number;
    tagIds: string[];
};

export type Note = {
    id: string;
    title: string;
    content: string;
    createdAt: number;
    dueDate?: number;
};

type StoreState = {
    tags: Tag[];
    items: Item[];
    notes: Note[];

    autoDeleteFinishedEnabled: boolean;
    autoDeleteFinishedAfterDays: number;

    // Actions
    addTag: (name: string, color: string) => void;
    deleteTag: (id: string) => void;

    addItem: (text: string, tagIds: string[], dueDate?: number, id?: string) => void;
    toggleItem: (id: string) => void;
    deleteItem: (id: string) => void;

    addNote: (title: string, content: string, dueDate?: number, id?: string) => void;
    updateNote: (id: string, title: string, content: string, dueDate?: number) => void;
    deleteNote: (id: string) => void;

    setAutoDeleteFinishedEnabled: (enabled: boolean) => void;
    setAutoDeleteFinishedAfterDays: (days: number) => void;
    cleanupFinishedItems: () => void;
};

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            tags: [
                { id: '1', name: 'Tasks', color: '#4caf50' },
                { id: '2', name: 'Shopping', color: '#ff9800' },
            ],
            items: [],
            notes: [],
            autoDeleteFinishedEnabled: false,
            autoDeleteFinishedAfterDays: 7,

            addTag: (name, color) => set((state) => ({
                tags: [...state.tags, { id: Date.now().toString(), name, color }]
            })),

            deleteTag: (id) => set((state) => ({
                tags: state.tags.filter(t => t.id !== id),
                // Optionally remove tag from items? For now let's leave them, simple logic.
            })),

            addItem: (text, tagIds, dueDate, id) =>
                set((state) => ({
                    items: [
                        ...state.items,
                        { id: id || Date.now().toString(), text, completed: false, createdAt: Date.now(), dueDate, tagIds },
                    ],
                })),

            toggleItem: (id) =>
                set((state) => ({
                    items: state.items.map((i) => {
                        if (i.id !== id) return i;
                        const nextCompleted = !i.completed;
                        return {
                            ...i,
                            completed: nextCompleted,
                            completedAt: nextCompleted ? Date.now() : undefined,
                        };
                    }),
                })),

            deleteItem: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),

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

            setAutoDeleteFinishedEnabled: (enabled) =>
                set(() => ({ autoDeleteFinishedEnabled: enabled })),

            setAutoDeleteFinishedAfterDays: (days) =>
                set(() => ({ autoDeleteFinishedAfterDays: Math.max(1, Math.floor(days || 1)) })),

            cleanupFinishedItems: () =>
                set((state) => {
                    if (!state.autoDeleteFinishedEnabled) return state;

                    const days = Math.max(1, Math.floor(state.autoDeleteFinishedAfterDays || 1));
                    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

                    const nextItems = state.items.filter((i) => {
                        if (!i.completed) return true;
                        const completedAt = i.completedAt ?? i.createdAt;
                        return completedAt > cutoff;
                    });

                    if (nextItems.length === state.items.length) return state;

                    return { ...state, items: nextItems };
                }),
        }),
        {
            name: 'info-list-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
