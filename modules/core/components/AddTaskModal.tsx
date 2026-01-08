import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useStore } from '../store';
import { DatePickerInput } from './DatePickerInput';
import { X } from 'lucide-react-native';
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
    const [selectedTagId, setSelectedTagId] = useState<string>(defaultTagId || '1');
    const [dueDate, setDueDate] = useState<number | undefined>();

    const reset = () => {
        setText('');
        setDueDate(undefined);
        setSelectedTagId(defaultTagId || '1');
    };

    const handleAdd = () => {
        if (text.trim()) {
            const id = Date.now().toString();

            addItem(text.trim(), [selectedTagId], dueDate, id);

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
                        <Text style={styles.title}>New Item</Text>
                        <Pressable onPress={handleClose}>
                            <X size={24} color={"#fff"} />
                        </Pressable>
                    </View>

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={"What needs to be done?"}
                        placeholderTextColor={"#666"}
                        value={text}
                        onChangeText={setText}
                        autoFocus={true}
                    />

                    <Text style={styles.label}>Tag</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagScroll}>
                        {tags.map(tag => (
                            <Pressable
                                key={tag.id}
                                style={[
                                    styles.tag,
                                    selectedTagId === tag.id && { backgroundColor: tag.color, borderColor: tag.color }
                                ]}
                                onPress={() => setSelectedTagId(tag.id)}
                            >
                                <Text style={[
                                    styles.tagText,
                                    selectedTagId === tag.id && { color: '#000' }
                                ]}>
                                    {tag.name}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    <Text style={styles.label}>Due Date (Optional)</Text>
                    <View style={styles.dateContainer}>
                        <DatePickerInput
                            date={dueDate}
                            onDateChange={setDueDate}
                            backgroundColor={"#333"}
                            iconColor={"#fff"}
                        />
                    </View>

                    <Pressable
                        style={[styles.addButton, { opacity: text.trim() ? 1 : 0.5 }]}
                        onPress={handleAdd}
                        disabled={!text.trim()}
                    >
                        <Text style={styles.addButtonText}>Create Task</Text>
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
        backgroundColor: '#1E1E1E',
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
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    label: {
        color: '#888',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 8,
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
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
        borderColor: '#666',
        backgroundColor: 'transparent',
    },
    tagText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    dateContainer: {
        alignItems: 'flex-start',
    },
    addButton: {
        backgroundColor: '#4caf50',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
