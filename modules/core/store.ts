import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Todo = {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
};

export type Note = {
    id: string;
    title: string;
    content: string;
    createdAt: number;
};

export type ShoppingItem = {
    id: string;
    text: string;
    completed: boolean;
    category?: string; // Optional for now
    createdAt: number;
};

type StoreState = {
    todos: Todo[];
    notes: Note[];
    shoppingList: ShoppingItem[];
    addTodo: (text: string) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    addNote: (title: string, content: string) => void;
    updateNote: (id: string, title: string, content: string) => void;
    deleteNote: (id: string) => void;
    addShoppingItem: (text: string) => void;
    toggleShoppingItem: (id: string) => void;
    deleteShoppingItem: (id: string) => void;
};

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            todos: [],
            notes: [],
            shoppingList: [],

            addTodo: (text) =>
                set((state) => ({
                    todos: [
                        ...state.todos,
                        { id: Date.now().toString(), text, completed: false, createdAt: Date.now() },
                    ],
                })),
            toggleTodo: (id) =>
                set((state) => ({
                    todos: state.todos.map((t) =>
                        t.id === id ? { ...t, completed: !t.completed } : t
                    ),
                })),
            deleteTodo: (id) =>
                set((state) => ({
                    todos: state.todos.filter((t) => t.id !== id),
                })),

            addNote: (title, content) =>
                set((state) => ({
                    notes: [
                        ...state.notes,
                        { id: Date.now().toString(), title, content, createdAt: Date.now() },
                    ],
                })),
            updateNote: (id, title, content) =>
                set((state) => ({
                    notes: state.notes.map((n) =>
                        n.id === id ? { ...n, title, content } : n
                    ),
                })),
            deleteNote: (id) =>
                set((state) => ({
                    notes: state.notes.filter((n) => n.id !== id),
                })),

            addShoppingItem: (text) =>
                set((state) => ({
                    shoppingList: [
                        ...state.shoppingList,
                        { id: Date.now().toString(), text, completed: false, createdAt: Date.now() },
                    ],
                })),
            toggleShoppingItem: (id) =>
                set((state) => ({
                    shoppingList: state.shoppingList.map((i) =>
                        i.id === id ? { ...i, completed: !i.completed } : i
                    ),
                })),
            deleteShoppingItem: (id) =>
                set((state) => ({
                    shoppingList: state.shoppingList.filter((i) => i.id !== id),
                })),
        }),
        {
            name: 'info-list-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
