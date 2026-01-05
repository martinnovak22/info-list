import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ShoppingItem as ShoppingItemType } from '../../core/store';
import { Trash2, Check, ShoppingBag } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

type Props = {
    item: ShoppingItemType;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
};

export const ShoppingItem = ({ item, onToggle, onDelete }: Props) => {
    return (
        <Animated.View
            style={styles.container}
            layout={Layout.springify()}
            entering={FadeIn}
            exiting={FadeOut}
        >
            <Pressable
                onPress={() => onToggle(item.id)}
                style={({ pressed }) => [styles.content, { opacity: pressed ? 0.7 : 1 }]}
            >
                <View style={[styles.iconBox, item.completed && styles.completedIconBox]}>
                    <ShoppingBag size={18} color={item.completed ? "#888" : "#fff"} />
                </View>
                <Text style={[styles.text, item.completed && styles.completedText]}>
                    {item.text}
                </Text>
            </Pressable>
            <Pressable
                onPress={() => onDelete(item.id)}
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
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800', // Orange accent for shopping
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FF9800',
        alignItems: 'center',
        justifyContent: 'center',
    },
    completedIconBox: {
        backgroundColor: '#333',
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
