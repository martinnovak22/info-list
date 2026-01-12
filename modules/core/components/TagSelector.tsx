import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { Tag, useStore } from '../store/store';
import { useToastStore } from '../store/toastStore';

type Props = {
    selectedTagId: string | null;
    onSelectTag: (id: string | null) => void;
    showUntagged?: boolean;
    onToggleUntagged?: () => void;
};

const COLORS = ['#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0', '#00bcd4', '#e91e63', '#795548'] as const;

export const TagSelector = ({
    selectedTagId,
    onSelectTag,
    showUntagged = false,
    onToggleUntagged,
}: Props) => {
    const { tags, addTag, deleteTag } = useStore();
    const { showToast } = useToastStore();

    const [showModal, setShowModal] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [selectedColor, setSelectedColor] = useState<(typeof COLORS)[number]>(COLORS[0]);

    const canDeleteTag = (tag: Tag) => tag.id !== '1' && tag.id !== '2';

    const allSelected = selectedTagId === null && !showUntagged;

    const handleCreateTag = () => {
        const name = newTagName.trim();
        if (!name) return;

        addTag(name, selectedColor);
        setNewTagName('');
        setShowModal(false);
        showToast('Tag created successfully', 'success');
    };

    const requestDeleteTag = (tag: Tag) => {
        if (!canDeleteTag(tag)) {
            showToast('Default tags cannot be deleted', 'error');
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
                    showToast(`Tag "${tag.name}" deleted`, 'success');
                },
            },
            6000
        );
    };

    const tagChips = useMemo(() => tags, [tags]);

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                <Pressable
                    style={[
                        styles.chip,
                        allSelected ? styles.chipSelected : styles.chipUnselected,
                        allSelected && styles.chipAllSelected,
                    ]}
                    onPress={() => {
                        onSelectTag(null);
                        if (showUntagged) {
                            onToggleUntagged?.();
                        }
                    }}
                >
                    <Text style={[styles.chipText, allSelected && styles.chipTextSelected]}>{'All'}</Text>
                </Pressable>

                {tagChips.map((tag) => {
                    const selected = selectedTagId === tag.id;
                    return (
                        <Pressable
                            key={tag.id}
                            style={[
                                styles.chip,
                                selected ? styles.chipSelected : styles.chipUnselected,
                                selected && { backgroundColor: `${tag.color}22`, borderColor: `${tag.color}66` },
                            ]}
                            onPress={() => onSelectTag(tag.id)}
                            onLongPress={() => requestDeleteTag(tag)}
                            delayLongPress={500}
                        >
                            <Text style={[styles.chipText, { color: tag.color }, selected && styles.chipTextSelected]}>
                                {tag.name}
                            </Text>
                        </Pressable>
                    );
                })}

                <Pressable
                    style={[
                        styles.chip,
                        showUntagged ? styles.chipSelected : styles.chipUnselected,
                        showUntagged && styles.chipAllSelected,
                    ]}
                    onPress={() => onToggleUntagged?.()}
                >
                    <Text style={[styles.chipText, showUntagged && styles.chipTextSelected]}>{'Unlabeled'}</Text>
                </Pressable>

                <Pressable
                    onPress={() => setShowModal(true)}
                    hitSlop={10}
                    style={({ pressed }) => [styles.addButton, { opacity: pressed ? 0.75 : 1 }]}
                >
                    <Plus size={18} color={'#fff'} />
                </Pressable>
            </ScrollView>

            <Modal visible={showModal} transparent animationType={'fade'}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{'New Tag'}</Text>
                            <Pressable onPress={() => setShowModal(false)}>
                                <X size={24} color={'#fff'} />
                            </Pressable>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder={'Tag Name'}
                            placeholderTextColor={'#666'}
                            value={newTagName}
                            onChangeText={setNewTagName}
                        />

                        <View style={styles.colorGrid}>
                            {COLORS.map((color) => (
                                <Pressable
                                    key={color}
                                    style={[
                                        styles.colorCircle,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.selectedColor,
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                />
                            ))}
                        </View>

                        <Pressable style={styles.createButton} onPress={handleCreateTag}>
                            <Text style={styles.createButtonText}>{'Create Tag'}</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    scroll: {
        gap: 8,
        paddingHorizontal: 2,
        paddingVertical: 2,
        alignItems: 'center',
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 999,
        borderWidth: 1,
        backgroundColor: '#1E1E1E',
        flexDirection: 'row',
        alignItems: 'center',
    },
    chipUnselected: {
        borderColor: 'rgba(255,255,255,0.10)',
    },
    chipSelected: {
        borderColor: 'rgba(255,255,255,0.18)',
    },
    chipAllSelected: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderColor: 'rgba(255,255,255,0.18)',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.2,
        color: '#bbb',
    },
    chipTextSelected: {
        color: '#fff',
    },
    addButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E1E1E',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
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
