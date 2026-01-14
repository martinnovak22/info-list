import { View, StyleSheet, FlatList, Pressable, Text } from 'react-native';
import { useStore } from '../../../modules/core/store/store';
import { theme } from '../../../modules/core/constants/theme';
import { TaskItem } from '../../../modules/core/components/TaskItem';
import { TagSelector } from '../../../modules/core/components/TagSelector';
import React, { useState } from 'react';
import { Plus } from 'lucide-react-native';
import { ScreenLayout } from '../../../modules/core/components/ScreenLayout';
import { EmptyState } from '../../../modules/core/components/EmptyState';
import { AddTaskModal } from '../../../modules/core/components/AddTaskModal';
import { FloatingAction } from '../../../modules/core/components/FloatingAction';
import { useTaskFilter } from '../../../modules/core/hooks/useTaskFilter';

export default function TasksScreen() {
    const {
        items,
        tags,
        toggleItem,
        deleteItem,
        autoDeleteFinishedEnabled,
        autoDeleteFinishedAfterDays,
        cleanupFinishedItems,
    } = useStore();

    const [isModalVisible, setModalVisible] = useState(false);

    React.useEffect(() => {
        if (autoDeleteFinishedEnabled) {
            cleanupFinishedItems();
        }
    }, [autoDeleteFinishedEnabled, autoDeleteFinishedAfterDays, cleanupFinishedItems]);

    const {
        filteredItems,
        selectedTagId,
        showUntagged,
        status,
        selectStatus,
        handleSelectTag,
        toggleUntagged,
    } = useTaskFilter(items);

    return (
        <ScreenLayout>

            <TagSelector
                selectedTagId={selectedTagId}
                onSelectTag={handleSelectTag}
                showUntagged={showUntagged}
                onToggleUntagged={toggleUntagged}
            />

            <View style={styles.segmented}>
                <Pressable
                    onPress={() => selectStatus('active')}
                    style={({ pressed }) => [
                        styles.segment,
                        status === 'active' && styles.segmentSelected,
                        { opacity: pressed ? 0.85 : 1 },
                    ]}
                >
                    <Text style={[styles.segmentText, status === 'active' && styles.segmentTextSelected]}>{'Active'}</Text>
                </Pressable>

                <Pressable
                    onPress={() => selectStatus('finished')}
                    style={({ pressed }) => [
                        styles.segment,
                        status === 'finished' && styles.segmentSelected,
                        { opacity: pressed ? 0.85 : 1 },
                    ]}
                >
                    <Text style={[styles.segmentText, status === 'finished' && styles.segmentTextSelected]}>{'Finished'}</Text>
                </Pressable>
            </View>

            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TaskItem item={item} tags={tags} onToggle={toggleItem} onDelete={deleteItem} />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<EmptyState text={'No tasks found'} />}
                showsVerticalScrollIndicator={false}
            />

            <FloatingAction onPress={() => setModalVisible(true)} Icon={Plus} />

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
    clearFilter: {
        color: theme.colors.textSecondary,
        fontSize: 14,
    },
    segmented: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: 14,
        padding: 4,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
        marginBottom: 12,
    },
    segment: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
    },
    segmentSelected: {
        backgroundColor: theme.colors.surfaceHighlight,
    },
    segmentText: {
        color: theme.colors.textTertiary,
        fontWeight: '800',
        fontSize: 13,
        letterSpacing: 0.2,
    },
    segmentTextSelected: {
        color: theme.colors.white,
    },
});
