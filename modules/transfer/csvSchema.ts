export const ITEMS_COLUMNS = ['text', 'completed', 'createdAt', 'dueDate', 'tags'] as const;
export const NOTES_COLUMNS = ['title', 'content', 'createdAt', 'dueDate'] as const;

export type ItemsCsvColumn = (typeof ITEMS_COLUMNS)[number];
export type NotesCsvColumn = (typeof NOTES_COLUMNS)[number];
