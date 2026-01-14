
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Item, Tag } from '../store/store';
import { Trash2, CheckCircle, Circle } from 'lucide-react-native';
import { theme } from '../constants/theme';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useToastStore } from '../store/toastStore';
import { cancelTaskNotification, scheduleTaskNotification } from '../utils/notifications';

type Props = {
    item: Item;
    tags: Tag[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
};

export const TaskItem = ({ item, tags, onToggle, onDelete }: Props) => {
    const { showToast } = useToastStore();

    const handleToggle = () => {
        onToggle(item.id);
        if (!item.completed) {
            cancelTaskNotification(item.id);
            showToast('Task completed!', 'success');
        } else {
            if (item.dueDate && item.dueDate > Date.now()) {
                scheduleTaskNotification(item.id, item.text, item.dueDate);
            }
        }
    };

    const handleDelete = () => {
        onDelete(item.id);
        cancelTaskNotification(item.id);
        showToast('Task deleted', 'info');
    };
    const primaryTagId = item.tagIds[0];
    const primaryTag = tags.find(t => t.id === item.tagIds[0]);
    const color = primaryTag?.color || theme.colors.textSecondary;

    const formattedDate = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : null;

    return (
        <Animated.View
            style={[styles.container, { borderLeftColor: color }]}
            layout={LinearTransition.springify()}
            entering={FadeIn}
            exiting={FadeOut}
        >
            <Pressable
                onPress={handleToggle}
                style={({ pressed }) => [styles.content, { opacity: pressed ? 0.7 : 1 }]}
            >
                {item.completed ? (
                    <CheckCircle size={24} color={color} />
                ) : (
                    <Circle size={24} color={color} />
                )}

                <View style={styles.textContainer}>
                    <Text style={[styles.text, item.completed && styles.textCompleted]}>
                        {item.text}
                    </Text>
                    <View style={styles.metaRow}>
                        {primaryTag && (
                            <View style={[styles.tagBadge, { backgroundColor: color + '20' }]}>
                                <Text style={[styles.tagText, { color }]}>{primaryTag.name}</Text>
                            </View>
                        )}
                        {formattedDate && (
                            <Text style={styles.dateText}>{formattedDate}</Text>
                        )}
                    </View>
                </View>
            </Pressable>

            <Pressable
                onPress={handleDelete}
                hitSlop={10}
                style={styles.deleteButton}
            >
                <Trash2 size={20} color={theme.colors.error} />
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        marginBottom: 8,
        minHeight: 56,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        color: theme.colors.white,
    },
    textCompleted: {
        textDecorationLine: 'line-through',
        color: theme.colors.textSecondary,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tagBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    dateText: {
        color: '#888',
        fontSize: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        padding: 8,
        marginLeft: 8,
    },
    tagDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        position: 'absolute',
        top: 12,
        right: 12,
    },
    time: {
        fontSize: 11,
        color: theme.colors.iconSecondary,
        marginTop: 4,
    },
});
