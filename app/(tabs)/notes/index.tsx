import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useStore } from '../../../modules/core/store';
import { NoteItem } from '../../../modules/notes/components/NoteItem';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { ScreenLayout } from '../../../modules/core/components/ScreenLayout';
import { EmptyState } from '../../../modules/core/components/EmptyState';

export default function NotesListScreen() {
    const { notes } = useStore();
    const router = useRouter();

    const handlePress = (id: string) => {
        router.push(`/(tabs)/notes/${id}`);
    };

    const handleAdd = () => {
        router.push(`/(tabs)/notes/new`);
    };

    return (
        <ScreenLayout>
            <FlatList
                data={notes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <NoteItem note={item} onPress={handlePress} />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <EmptyState text="No notes yet" />
                }
            />

            <Pressable
                onPress={handleAdd}
                style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.7 : 1 }]}
            >
                <Plus size={24} color="#000" />
            </Pressable>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    list: {
        // padding handled by ScreenLayout, but maybe we need bottom padding for scrolling past FAB
        paddingBottom: 100,
    },

    fab: {
        position: 'absolute',
        bottom: 20,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
    },
});
