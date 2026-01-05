import { View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStore } from '../../../modules/core/store';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import { Trash2, Save } from 'lucide-react-native';

export default function NoteDetailScreen() {
    const { id } = useLocalSearchParams();
    const { notes, addNote, updateNote, deleteNote } = useStore();
    const router = useRouter();
    const navigation = useNavigation();

    const noteId = Array.isArray(id) ? id[0] : id;
    const isNew = noteId === 'new';

    const existingNote = notes.find(n => n.id === noteId);

    const [title, setTitle] = useState(existingNote?.title || '');
    const [content, setContent] = useState(existingNote?.content || '');

    // Update headers
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: isNew ? 'New Note' : 'Edit Note',
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#121212' },
            headerRight: () => (
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    {!isNew && (
                        <TouchableOpacity onPress={handleDelete}>
                            <Trash2 size={24} color="#ff5252" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={handleSave}>
                        <Save size={24} color="#4caf50" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, isNew, title, content]);

    const handleSave = () => {
        if (!title.trim() && !content.trim()) return;

        if (isNew) {
            addNote(title, content);
        } else {
            updateNote(noteId!, title, content);
        }
        router.back();
    };

    const handleDelete = () => {
        Alert.alert('Delete Note', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    deleteNote(noteId!);
                    router.back();
                }
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.titleInput}
                placeholder="Title"
                placeholderTextColor="#666"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.contentInput}
                placeholder="Start typing..."
                placeholderTextColor="#666"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 16,
    },
    titleInput: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    contentInput: {
        fontSize: 16,
        color: '#ddd',
        flex: 1,
    },
});
