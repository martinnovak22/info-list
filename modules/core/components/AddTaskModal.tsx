import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useStore } from '../store/store';
import { DatePickerInput } from './DatePickerInput';
import { X } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { scheduleTaskNotification } from '../utils/notifications';
import { useToastStore } from '../store/toastStore';

type Props = {
    visible: boolean;
    onClose: () => void;
    defaultTagId?: string | null;
};

export const AddTaskModal = ({ visible, onClose, defaultTagId }: Props) => {
    const { tags, addItem } = useStore();
    const { showToast } = useToastStore();
    const [text, setText] = useState('');
    const [selectedTagId, setSelectedTagId] = useState<string | null>(defaultTagId ?? null);
    const [dueDate, setDueDate] = useState<number | undefined>();

    const reset = () => {
        setText('');
        setDueDate(undefined);
        setSelectedTagId(defaultTagId ?? null);
    };

    const handleAdd = () => {
        if (text.trim()) {
            const id = Date.now().toString();

            addItem(text.trim(), selectedTagId ? [selectedTagId] : [], dueDate, id);

            if (dueDate) {
                scheduleTaskNotification(id, text.trim(), dueDate);
            }

            showToast('Task added', 'success');
            reset();
            onClose();
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal visible={visible} animationType={"fade"} transparent>
            <KeyboardAvoidingView
                behavior={"padding"}
                style={styles.overlay}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{'New Item'}</Text>
                        <Pressable onPress={handleClose}>
                            <X size={24} color={theme.colors.white} />
                        </Pressable>
                    </View>

                    <Text style={styles.label}>{'Description'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={"What needs to be done?"}
                        placeholderTextColor={theme.colors.textSecondary}
                        value={text}
                        onChangeText={setText}
                        autoFocus={true}
                    />

                    <Text style={styles.label}>{'Tag'}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagScroll}>
                        <Pressable
                            style={[
                                styles.tag,
                                selectedTagId === null && styles.noneTagSelected,
                            ]}
                            onPress={() => setSelectedTagId(null)}
                        >
                            <Text style={[
                                styles.tagText,
                                selectedTagId === null && styles.noneTagTextSelected,
                            ]}>
                                {'None'}
                            </Text>
                        </Pressable>

                        {tags.map(tag => (
                            <Pressable
                                key={tag.id}
                                style={[
                                    styles.tag,
                                    { borderColor: tag.color },
                                    selectedTagId === tag.id && { backgroundColor: tag.color }
                                ]}
                                onPress={() => setSelectedTagId(tag.id)}
                            >
                                <Text style={[
                                    styles.tagText,
                                    { color: tag.color },
                                    selectedTagId === tag.id && { color: theme.colors.surface }
                                ]}>
                                    {tag.name}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    <Text style={styles.label}>{'Due Date (Optional)'}</Text>
                    <View style={styles.dateContainer}>
                        <DatePickerInput
                            date={dueDate}
                            onDateChange={setDueDate}
                            backgroundColor={theme.colors.surfaceHighlight}
                            iconColor={theme.colors.white}
                        />
                    </View>

                    <Pressable
                        style={[styles.addButton, { opacity: text.trim() ? 1 : 0.5 }]}
                        onPress={handleAdd}
                        disabled={!text.trim()}
                    >
                        <Text style={styles.addButtonText}>{'Create Task'}</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        gap: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        color: theme.colors.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
    label: {
        color: theme.colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
    },
    input: {
        backgroundColor: theme.colors.surfaceHighlight,
        color: theme.colors.text,
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
    },
    tagScroll: {
        gap: 8,
    },
    tag: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: 'transparent',
    },
    tagText: {
        color: theme.colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    noneTagSelected: {
        backgroundColor: theme.colors.surfaceHighlight,
        borderColor: theme.colors.surfaceHighlight,
    },
    noneTagTextSelected: {
        color: theme.colors.white,
    },
    dateContainer: {
        alignItems: 'flex-start',
    },
    addButton: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    addButtonText: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
