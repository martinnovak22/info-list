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

// Legacy types for migration
type LegacyTodo = { id: string; text: string; completed: boolean; createdAt: number; dueDate?: number; };
type LegacyShoppingItem = { id: string; text: string; completed: boolean; createdAt: number; dueDate?: number; };

type StoreState = {
    tags: Tag[];
    items: Item[];
    notes: Note[];

    // Actions
    addTag: (name: string, color: string) => void;
    deleteTag: (id: string) => void;

    addItem: (text: string, tagIds: string[], dueDate?: number) => void;
    toggleItem: (id: string) => void;
    deleteItem: (id: string) => void;

    addNote: (title: string, content: string, dueDate?: number) => void;
    updateNote: (id: string, title: string, content: string, dueDate?: number) => void;
    deleteNote: (id: string) => void;
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

            addTag: (name, color) => set((state) => ({
                tags: [...state.tags, { id: Date.now().toString(), name, color }]
            })),

            deleteTag: (id) => set((state) => ({
                tags: state.tags.filter(t => t.id !== id),
                // Optionally remove tag from items? For now let's leave them, simple logic.
            })),

            addItem: (text, tagIds, dueDate) =>
                set((state) => ({
                    items: [
                        ...state.items,
                        { id: Date.now().toString(), text, completed: false, createdAt: Date.now(), dueDate, tagIds },
                    ],
                })),

            toggleItem: (id) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, completed: !i.completed } : i
                    ),
                })),

            deleteItem: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),

            addNote: (title, content, dueDate) =>
                set((state) => ({
                    notes: [
                        ...state.notes,
                        { id: Date.now().toString(), title, content, createdAt: Date.now(), dueDate },
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
        }),
        {
            name: 'info-list-storage',
            storage: createJSONStorage(() => AsyncStorage),
            merge: (persistedState: any, currentState) => {
                // Migration Logic
                const newState = { ...currentState, ...persistedState };

                // If we detect legacy data (todos or shoppingList) and NO items, execute migration
                // We check if 'todos' exists in the persisted state
                if (persistedState.todos && Array.isArray(persistedState.todos) && persistedState.todos.length > 0) {
                    const legacyTodos = persistedState.todos as LegacyTodo[];
                    // Convert to items with Tag ID '1' (Tasks)
                    const newItems = legacyTodos.map(t => ({
                        id: t.id,
                        text: t.text,
                        completed: t.completed,
                        createdAt: t.createdAt,
                        dueDate: t.dueDate,
                        tagIds: ['1']
                    }));
                    newState.items = [...newState.items, ...newItems];
                    delete persistedState.todos; // Clear legacy to prevent re-migration
                }

                if (persistedState.shoppingList && Array.isArray(persistedState.shoppingList) && persistedState.shoppingList.length > 0) {
                    const legacyShopping = persistedState.shoppingList as LegacyShoppingItem[];
                    // Convert to items with Tag ID '2' (Shopping)
                    const newItems = legacyShopping.map(i => ({
                        id: i.id,
                        text: i.text,
                        completed: i.completed,
                        createdAt: i.createdAt,
                        dueDate: i.dueDate,
                        tagIds: ['2']
                    }));
                    newState.items = [...newState.items, ...newItems];
                    delete persistedState.shoppingList;
                }

                return newState;
            },
        }
    )
);
