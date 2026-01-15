import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Note } from '../../../modules/core/store/store';
import { ChevronRight } from 'lucide-react-native';
import { theme } from '../../../modules/core/constants/theme';
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
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>{note.title || 'Untitled Note'}</Text>
                    <Text style={styles.content} numberOfLines={2}>
                        {note.content || 'No additional text'}
                    </Text>
                </View>
                <ChevronRight size={20} color={theme.colors.textSecondary} />
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.white,
        marginBottom: 4,
    },
    content: {
        fontSize: 14,
        color: theme.colors.iconSecondary,
    },
});
