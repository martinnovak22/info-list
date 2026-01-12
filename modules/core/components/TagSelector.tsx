import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { Tag, useStore } from '../store/store';
import { useToastStore } from '../store/toastStore';
import { Plus, X } from 'lucide-react-native';

type Props = {
    selectedTagId: string | null;
    onSelectTag: (id: string | null) => void;
};

const COLORS = ['#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0', '#00bcd4', '#e91e63', '#795548'];

export const TagSelector = ({ selectedTagId, onSelectTag }: Props) => {
    const { tags, addTag, deleteTag } = useStore();
    const { showToast } = useToastStore();
    const [showModal, setShowModal] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);

    const handleAddTag = () => {
        if (newTagName.trim()) {
            addTag(newTagName.trim(), selectedColor);
            setNewTagName('');
            setShowModal(false);
            showToast('Tag created successfully', 'success');
        }
    };

    const handleLongPress = (tag: Tag) => {
        if (tag.id === '1' || tag.id === '2') {
            showToast("Default tags cannot be deleted", "error");
            return;
        }

        showToast(
            `Delete "${tag.name}"?`,
            'info',
            {
                label: 'DELETE',
                onPress: () => {
                    if (selectedTagId === tag.id) {
                        onSelectTag(null);
                    }
                    deleteTag(tag.id);
                    showToast(`Tag "${tag.name}" deleted`, "success");
                }
            },
            6000
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Pressable
                    style={[styles.tag, selectedTagId === null && styles.selectedTag, { borderColor: '#666' }]}
                    onPress={() => onSelectTag(null)}
                >
                    <Text style={[styles.tagText, selectedTagId === null && styles.selectedTagText]}>All</Text>
                </Pressable>

                {tags.map((tag) => (
                    <Pressable
                        key={tag.id}
                        style={[styles.tag, selectedTagId === tag.id && styles.selectedTag, { borderColor: tag.color }]}
                        onPress={() => onSelectTag(tag.id)}
                        onLongPress={() => handleLongPress(tag)}
                        delayLongPress={500}
                    >
                        <Text style={[styles.tagText, { color: tag.color }, selectedTagId === tag.id && styles.selectedTagText]}>
                            {tag.name}
                        </Text>
                    </Pressable>
                ))}

                <Pressable style={[styles.tag, styles.addTag]} onPress={() => setShowModal(true)}>
                    <Plus size={16} color={"#fff"} />
                    <Text style={styles.addTagText}>New</Text>
                </Pressable>
            </ScrollView>

            <Modal visible={showModal} transparent animationType={"fade"}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Tag</Text>
                            <Pressable onPress={() => setShowModal(false)}>
                                <X size={24} color={"#fff"} />
                            </Pressable>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder={"Tag Name"}
                            placeholderTextColor={"#666"}
                            value={newTagName}
                            onChangeText={setNewTagName}
                        />

                        <View style={styles.colorGrid}>
                            {COLORS.map(color => (
                                <Pressable
                                    key={color}
                                    style={[styles.colorCircle, { backgroundColor: color }, selectedColor === color && styles.selectedColor]}
                                    onPress={() => setSelectedColor(color)}
                                />
                            ))}
                        </View>

                        <Pressable style={styles.createButton} onPress={handleAddTag}>
                            <Text style={styles.createButtonText}>Create Tag</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    scroll: {
        gap: 8,
        paddingHorizontal: 4,
    },
    tag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: '#1E1E1E',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    selectedTag: {
        backgroundColor: '#333',
    },
    tagText: {
        color: '#fff',
        fontWeight: '600',
    },
    selectedTagText: {
        color: '#fff',
    },
    addTag: {
        borderColor: '#666',
        borderStyle: 'dashed',
    },
    addTagText: {
        color: '#ccc',
        fontSize: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 20,
        gap: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#333',
        color: '#fff',
        padding: 16,
        borderRadius: 8,
        fontSize: 16,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    colorCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    selectedColor: {
        borderWidth: 2,
        borderColor: '#fff',
    },
    createButton: {
        backgroundColor: '#4caf50',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
