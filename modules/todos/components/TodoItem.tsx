import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Trash2, CheckCircle, Circle } from 'lucide-react-native';
import { Todo } from '../../core/store';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

type Props = {
    todo: Todo;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
};

export const TodoItem = ({ todo, onToggle, onDelete }: Props) => {
    return (
        <Animated.View
            style={styles.container}
            layout={Layout.springify()}
            entering={FadeIn}
            exiting={FadeOut}
        >
            <Pressable
                onPress={() => onToggle(todo.id)}
                style={({ pressed }) => [styles.content, { opacity: pressed ? 0.7 : 1 }]}
            >
                {todo.completed ? (
                    <CheckCircle size={24} color="#4caf50" />
                ) : (
                    <Circle size={24} color="#666" />
                )}
                <Text style={[styles.text, todo.completed && styles.completedText]}>
                    {todo.text}
                </Text>
            </Pressable>
            <Pressable
                onPress={() => onDelete(todo.id)}
                hitSlop={10}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
                <Trash2 size={20} color="#ff5252" />
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
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#666',
    },
});
