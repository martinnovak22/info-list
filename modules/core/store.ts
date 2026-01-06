import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Todo = {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
    dueDate?: number;
};

export type Note = {
    id: string;
    title: string;
    content: string;
    createdAt: number;
    dueDate?: number;
};

export type ShoppingItem = {
    id: string;
    text: string;
    completed: boolean;
    category?: string; // Optional for now
    createdAt: number;
    dueDate?: number;
};

type StoreState = {
    todos: Todo[];
    notes: Note[];
    shoppingList: ShoppingItem[];
    addTodo: (text: string, dueDate?: number) => void;
    toggleTodo: (id: string) => void;
    deleteTodo: (id: string) => void;
    addNote: (title: string, content: string, dueDate?: number) => void;
    updateNote: (id: string, title: string, content: string, dueDate?: number) => void;
    deleteNote: (id: string) => void;
    addShoppingItem: (text: string, dueDate?: number) => void;
    toggleShoppingItem: (id: string) => void;
    deleteShoppingItem: (id: string) => void;
};

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            todos: [],
            notes: [],
            shoppingList: [],

            addTodo: (text, dueDate) =>
                set((state) => ({
                    todos: [
                        ...state.todos,
                        { id: Date.now().toString(), text, completed: false, createdAt: Date.now(), dueDate },
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

            addShoppingItem: (text, dueDate) =>
                set((state) => ({
                    shoppingList: [
                        ...state.shoppingList,
                        { id: Date.now().toString(), text, completed: false, createdAt: Date.now(), dueDate },
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
