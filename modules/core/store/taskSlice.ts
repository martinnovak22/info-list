import { StateCreator } from 'zustand';
import { theme } from '../constants/theme';

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

export interface TaskSlice {
    tags: Tag[];
    items: Item[];
    autoDeleteFinishedEnabled: boolean;
    autoDeleteFinishedAfterDays: number;

    addTag: (name: string, color: string) => void;
    deleteTag: (id: string) => void;

    addItem: (text: string, tagIds: string[], dueDate?: number, id?: string) => void;
    toggleItem: (id: string) => void;
    deleteItem: (id: string) => void;

    setAutoDeleteFinishedEnabled: (enabled: boolean) => void;
    setAutoDeleteFinishedAfterDays: (days: number) => void;
    cleanupFinishedItems: () => void;
}

export const createTaskSlice: StateCreator<TaskSlice> = (set) => ({
    tags: [
        { id: '1', name: 'Tasks', color: theme.palette.green },
        { id: '2', name: 'Shopping', color: theme.palette.orange },
    ],
    items: [],
    autoDeleteFinishedEnabled: false,
    autoDeleteFinishedAfterDays: 7,

    addTag: (name, color) => set((state) => ({
        tags: [...state.tags, { id: Date.now().toString(), name, color }]
    })),

    deleteTag: (id) => set((state) => ({
        tags: state.tags.filter(t => t.id !== id),
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
});
