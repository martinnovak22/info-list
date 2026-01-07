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
                style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.8 : 1 }]}
            >
                <Plus size={32} color={"#fff"} />
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
        bottom: 24,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#4caf50',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
});
