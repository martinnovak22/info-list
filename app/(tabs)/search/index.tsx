import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, SectionList, Text, Pressable } from 'react-native';
import { useStore, Item, Note } from '../../../modules/core/store/store';
import { theme } from '../../../modules/core/constants/theme';
import { ScreenLayout } from '../../../modules/core/components/ScreenLayout';
import { TaskItem } from '../../../modules/core/components/TaskItem';
import { NoteItem } from '../../../modules/notes/components/NoteItem';
import { Search as SearchIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '../../../modules/core/components/EmptyState';

type Section = {
    title: string;
    data: ReadonlyArray<Item | Note>;
    type: 'task' | 'note';
};

export default function SearchScreen() {
    const { items, notes, tags, toggleItem, deleteItem } = useStore();
    const [query, setQuery] = useState('');
    const router = useRouter();

    const sections = useMemo<Section[]>(() => {
        if (!query.trim()) return [];

        const lowerQuery = query.toLowerCase();

        const filteredTasks = items.filter(item =>
            item.text.toLowerCase().includes(lowerQuery)
        );

        const filteredNotes = notes.filter(note =>
            note.title.toLowerCase().includes(lowerQuery) ||
            note.content.toLowerCase().includes(lowerQuery)
        );

        const result: Section[] = [];
        if (filteredTasks.length > 0) {
            result.push({ title: 'Tasks', data: filteredTasks, type: 'task' });
        }
        if (filteredNotes.length > 0) {
            result.push({ title: 'Notes', data: filteredNotes, type: 'note' });
        }
        return result;
    }, [query, items, notes]);

    const handleNotePress = (id: string) => {
        router.push(`/(tabs)/notes/${id}`);
    };

    return (
        <ScreenLayout>
            <View style={styles.searchContainer}>
                <SearchIcon size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={"Search items and notes..."}
                    placeholderTextColor={theme.colors.textSecondary}
                    value={query}
                    onChangeText={setQuery}
                    autoFocus={false}
                />
            </View>

            <SectionList<Item | Note, Section>
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item, section }) => {
                    if (section.type === 'task') {
                        return (
                            <TaskItem
                                item={item as Item}
                                tags={tags}
                                onToggle={toggleItem}
                                onDelete={deleteItem}
                            />
                        );
                    } else {
                        return (
                            <NoteItem
                                note={item as Note}
                                onPress={handleNotePress}
                            />
                        );
                    }
                }}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    query.trim() ? <EmptyState text={"No results found"} /> :
                        <View style={styles.startSearch}>
                            <SearchIcon size={48} color={theme.colors.border} />
                            <Text style={styles.startSearchText}>Type to search...</Text>
                        </View>
                }
                stickySectionHeadersEnabled={false}
            />
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        color: theme.colors.text,
        fontSize: 16,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginTop: 16,
        marginBottom: 8,
    },
    list: {
        paddingBottom: 40,
    },
    startSearch: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        opacity: 0.5,
    },
    startSearchText: {
        color: theme.colors.textSecondary,
        marginTop: 16,
        fontSize: 16,
    },
});
