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

import { theme } from '../constants/theme';

const COLORS = [
    theme.palette.green,
    theme.palette.orange,
    theme.palette.red,
    theme.palette.blue,
    theme.palette.purple,
    theme.palette.cyan,
    theme.palette.pink,
    theme.palette.brown
] as const;

export const TagSelector = ({
    selectedTagId,
    onSelectTag,
    showUntagged = false,
    onToggleUntagged,
}: Props) => {
    const { tags, addTag, deleteTag } = useStore();
    const { showToast } = useToastStore();

    const [isAdding, setIsAdding] = useState(false);
    const [newTagName, setNewTagName] = useState('');
    const [selectedColor, setSelectedColor] = useState<(typeof COLORS)[number]>(COLORS[0]);

    const canDeleteTag = (tag: Tag) => tag.id !== '1' && tag.id !== '2';

    const allSelected = selectedTagId === null && !showUntagged;

    const handleCreateTag = () => {
        const name = newTagName.trim();
        if (!name) return;

        addTag(name, selectedColor);
        setNewTagName('');
        setIsAdding(false);
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
            <Text style={styles.header}>{'Categories:'}</Text>
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
                        if (showUntagged) {
                            onToggleUntagged?.();
                            return;
                        }

                        onSelectTag(null);
                    }}
                >
                    <Text style={[styles.chipText, allSelected && styles.chipTextSelected]}>{'All'}</Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.chip,
                        showUntagged ? styles.chipSelected : styles.chipUnselected,
                        showUntagged && styles.chipAllSelected,
                    ]}
                    onPress={() => onToggleUntagged?.()}
                >
                    <Text style={[styles.chipText, showUntagged && styles.chipTextSelected]}>{'None'}</Text>
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
                    style={[styles.addButton, isAdding && styles.addButtonActive]}
                    onPress={() => setIsAdding(!isAdding)}
                >
                    <Plus size={18} color={theme.colors.white} />
                </Pressable>
            </ScrollView>

            <Modal visible={isAdding} transparent animationType={'fade'}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{'New Tag'}</Text>
                            <Pressable onPress={() => setIsAdding(false)} style={styles.closeButton}>
                                <X size={24} color={theme.colors.white} />
                            </Pressable>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Tag name"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={newTagName}
                            onChangeText={setNewTagName}
                        />

                        <View style={styles.colors}>
                            {COLORS.map((color) => (
                                <Pressable
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.colorSelected,
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
    header: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
    },
    tagText: {
        fontSize: 13,
        fontWeight: '600',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
    },
    addButtonActive: {
        backgroundColor: theme.colors.surfaceHighlight,
        borderStyle: 'solid',
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
    inputContainer: {
        marginBottom: 16,
        backgroundColor: theme.colors.surface,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    inputHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    inputTitle: {
        color: theme.colors.textTertiary,
        fontSize: 12,
        fontWeight: '600',
    },
    closeButton: {
        padding: 4,
    },
    input: {
        color: theme.colors.white,
        fontSize: 16,
        marginBottom: 12,
        padding: 0,
    },
    colors: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    colorOption: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    colorSelected: {
        borderWidth: 2,
        borderColor: theme.colors.white,
    },
    createButton: {
        backgroundColor: theme.colors.surface,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    createButtonDisabled: {
        opacity: 0.5,
    },
    createButtonText: {
        color: theme.colors.white,
        fontWeight: '600',
        fontSize: 14,
    },
});
