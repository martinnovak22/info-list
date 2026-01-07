import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Note } from '../../core/store';
import { ChevronRight } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

type Props = {
    note: Note;
    onPress: (id: string) => void;
};

export const NoteItem = ({ note, onPress }: Props) => {
    return (
        <Animated.View
            layout={Layout.springify()}
            entering={FadeIn}
            exiting={FadeOut}
        >
            <Pressable
                style={({ pressed }) => [styles.container, { opacity: pressed ? 0.7 : 1 }]}
                onPress={() => onPress(note.id)}
            >
                <View style={styles.content}>
                    <Text style={styles.title} numberOfLines={1}>{note.title || 'Untitled'}</Text>
                    <Text style={styles.preview} numberOfLines={2}>{note.content}</Text>
                </View>
                <ChevronRight size={20} color={"#666"} />
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
        flex: 1,
        marginRight: 10,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    preview: {
        color: '#aaa',
        fontSize: 14,
    },
});
