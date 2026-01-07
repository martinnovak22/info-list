import { View, StyleSheet, FlatList, Pressable, Platform, Text } from 'react-native';
import { useStore } from '../../../modules/core/store';
import { TaskItem } from '../../../modules/core/components/TaskItem';
import { TagSelector } from '../../../modules/core/components/TagSelector';
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react-native';
import { ScreenLayout } from '../../../modules/core/components/ScreenLayout';
import { EmptyState } from '../../../modules/core/components/EmptyState';
import { AddTaskModal } from '../../../modules/core/components/AddTaskModal';

export default function TasksScreen() {
    const { items, tags, toggleItem, deleteItem } = useStore();
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const filteredItems = useMemo(() => {
        if (!selectedTagId) return items;
        return items.filter(item => item.tagIds.includes(selectedTagId));
    }, [items, selectedTagId]);

    const currentTag = selectedTagId ? tags.find(t => t.id === selectedTagId) : null;
    const headerText = currentTag ? currentTag.name : "All Tasks";
    const fabColor = '#4caf50';

    return (
        <ScreenLayout>
            <View style={styles.headerContainer}>
                <Text style={[styles.headerTitle, { color: currentTag ? currentTag.color : '#fff' }]}>
                    {headerText}
                </Text>
                {selectedTagId && (
                    <Pressable onPress={() => setSelectedTagId(null)} hitSlop={10}>
                        <Text style={styles.clearFilter}>Show All</Text>
                    </Pressable>
                )}
            </View>

            <TagSelector
                selectedTagId={selectedTagId}
                onSelectTag={setSelectedTagId}
            />

            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TaskItem item={item} tags={tags} onToggle={toggleItem} onDelete={deleteItem} />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <EmptyState text={"No tasks found"} />
                }
            />

            <Pressable
                style={({ pressed }) => [
                    styles.fab,
                    { backgroundColor: fabColor, opacity: pressed ? 0.8 : 1 }
                ]}
                onPress={() => setModalVisible(true)}
            >
                <Plus size={32} color={"#fff"} />
            </Pressable>

            <AddTaskModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                defaultTagId={selectedTagId}
            />
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    list: {
        paddingBottom: 100,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    clearFilter: {
        color: '#666',
        fontSize: 14,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
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
