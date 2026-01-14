import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useStore } from '../../../modules/core/store/store';
import { NoteItem } from '../../../modules/notes/components/NoteItem';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { ScreenLayout } from '../../../modules/core/components/ScreenLayout';
import { EmptyState } from '../../../modules/core/components/EmptyState';
import { FloatingAction } from '../../../modules/core/components/FloatingAction';

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

            <FloatingAction onPress={handleAdd} Icon={Plus} />
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    list: {
        paddingBottom: 100,
    },
});
