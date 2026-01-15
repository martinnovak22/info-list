import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Item, Tag } from '../store/store';
import { Trash2, Check, Circle, Archive } from 'lucide-react-native';
import { theme } from '../constants/theme';
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useToastStore } from '../store/toastStore';
import { cancelTaskNotification, scheduleTaskNotification } from '../utils/notifications';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

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

    const renderLeftActions = (_progress: any, dragX: any) => {
        return (
            <View style={styles.leftAction}>
                <Check size={24} color={theme.colors.white} />
            </View>
        );
    };

    const renderRightActions = (_progress: any, dragX: any) => {
        return (
            <View style={styles.rightAction}>
                <Trash2 size={24} color={theme.colors.white} />
            </View>
        );
    };

    return (
        <Animated.View
            style={[styles.containerWrapper]}
            layout={LinearTransition.springify()}
            entering={FadeIn}
            exiting={FadeOut}
        >
            <Swipeable
                renderLeftActions={renderLeftActions}
                renderRightActions={renderRightActions}
                onSwipeableOpen={(direction) => {
                    if (direction === 'left') {
                        handleDelete();
                    } else if (direction === 'right') {
                        handleToggle();
                    }
                }}
                containerStyle={styles.swipeableContainer}
            >
                <Pressable
                    onPress={handleToggle}
                    style={({ pressed }) => [
                        styles.container,
                        { borderLeftColor: color },
                        { opacity: pressed ? 0.9 : 1, backgroundColor: theme.colors.surface }
                    ]}
                >
                    {item.completed ? (
                        <Check size={24} color={color} />
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
            </Swipeable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    containerWrapper: {
        marginBottom: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    swipeableContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.surface,
        minHeight: 56,
        borderLeftWidth: 3,
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
        marginTop: 4,
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
    leftAction: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 20,
    },
    rightAction: {
        flex: 1,
        backgroundColor: theme.colors.error,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 20,
    },
});
