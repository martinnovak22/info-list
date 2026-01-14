import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskSlice, createTaskSlice, Tag, Item } from './taskSlice';
import { NoteSlice, createNoteSlice, Note } from './noteSlice';

export type { Tag, Item, Note };

type StoreState = TaskSlice & NoteSlice;

export const useStore = create<StoreState>()(
    persist(
        (...a) => ({
            ...createTaskSlice(...a),
            ...createNoteSlice(...a),
        }),
        {
            name: 'info-list-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
