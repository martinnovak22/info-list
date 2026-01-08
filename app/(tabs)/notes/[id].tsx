import { TextInput, StyleSheet, Alert, View, Pressable, Text } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useNavigation } from 'expo-router';
import { useStore } from '../../../modules/core/store';
import { useState, useLayoutEffect } from 'react';
import { Trash2, Save, ArrowLeft } from 'lucide-react-native';
import { ScreenLayout } from '../../../modules/core/components/ScreenLayout';
import { useToastStore } from '../../../modules/core/store/toastStore';
import { cancelTaskNotification, scheduleTaskNotification } from '../../../modules/core/utils/notifications';

import { DatePickerInput } from '../../../modules/core/components/DatePickerInput';

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
    const [dueDate, setDueDate] = useState<number | undefined>(existingNote?.dueDate);

    useLayoutEffect(() => {
        navigation.getParent()?.setOptions({
            title: isNew ? 'New Note' : 'Edit Note',
            headerLeft: () => (
                <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, marginRight: 16 })}>
                    <ArrowLeft size={24} color="#fff" />
                </Pressable>
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    {!isNew && (
                        <Pressable
                            onPress={handleDelete}
                            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                        >
                            <Trash2 size={24} color="#ff5252" />
                        </Pressable>
                    )}
                    <Pressable
                        onPress={handleSave}
                        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                    >
                        <Save size={24} color="#4caf50" />
                    </Pressable>
                </View>
            ),
        });

        return () => {
            navigation.getParent()?.setOptions({ title: 'Notes', headerRight: undefined, headerLeft: undefined });
        };
    }, [navigation, isNew, title, content, dueDate]);

    const { showToast } = useToastStore();

    const handleSave = () => {
        if (!title.trim() && !content.trim()) return;

        const id = isNew ? Date.now().toString() : noteId!;

        if (isNew) {
            addNote(title, content, dueDate, id);
            showToast('Note created', 'success');
        } else {
            updateNote(noteId!, title, content, dueDate);
            showToast('Note updated', 'success');
            cancelTaskNotification(noteId!);
        }

        if (dueDate) {
            scheduleTaskNotification(id, title || 'Note Reminder', dueDate);
        }

        router.back();
    };

    const handleDelete = () => {
        deleteNote(noteId!);
        cancelTaskNotification(noteId!);
        showToast('Note deleted', 'info');
        router.back();
    };

    return (
        <ScreenLayout style={styles.container}>
            <View style={styles.dateContainer}>
                <DatePickerInput date={dueDate} onDateChange={setDueDate} />
            </View>
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
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
    },
    dateContainer: {
        marginBottom: 16,
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
