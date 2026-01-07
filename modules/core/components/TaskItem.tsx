import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Item, Tag } from '../store';
import { Trash2, CheckCircle, Circle } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

type Props = {
    item: Item;
    tags: Tag[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
};

export const TaskItem = ({ item, tags, onToggle, onDelete }: Props) => {
    const primaryTagId = item.tagIds[0];
    const primaryTag = tags.find(t => t.id === primaryTagId);
    const color = primaryTag?.color || '#666';

    const formattedDate = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : null;

    return (
        <Animated.View
            style={[styles.container, { borderLeftColor: color }]}
            layout={Layout.springify()}
            entering={FadeIn}
            exiting={FadeOut}
        >
            <Pressable
                onPress={() => onToggle(item.id)}
                style={({ pressed }) => [styles.content, { opacity: pressed ? 0.7 : 1 }]}
            >
                {item.completed ? (
                    <CheckCircle size={24} color={color} />
                ) : (
                    <Circle size={24} color={color} />
                )}

                <View style={styles.textContainer}>
                    <Text style={[styles.text, item.completed && styles.completedText]}>
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
                onPress={() => onDelete(item.id)}
                hitSlop={10}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
                <Trash2 size={20} color={"#ff5252"} />
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 4,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    textContainer: {
        flex: 1,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 4,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#666',
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
});
