import React from 'react';
import {View, Text, StyleSheet, Pressable, ActivityIndicator} from 'react-native';
import { ScreenLayout } from '../../modules/core/components/ScreenLayout';
import { Download, Upload, FileText } from 'lucide-react-native';
import {exportItemsCsv, exportNotesCsv, importItemsCsv, importNotesCsv} from "../../modules/transfer/transferService";
import { useToastStore } from '../../modules/core/store/toastStore';

export default function SettingsScreen() {
    const [busy, setBusy] = React.useState<{items?: boolean; notes?: boolean}>({});
    const { showToast } = useToastStore();

    const handleExportCSV = async (type: 'items' | 'notes') => {
        try {
            setBusy(prev => ({ ...prev, [type]: true }));
            if (type === 'items') {
                await exportItemsCsv();
                showToast('Tasks exported', 'success');
            }
            else {
                await exportNotesCsv();
                showToast('Notes exported', 'success');
            }
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Export failed', 'error');
        } finally {
            setBusy(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleImportCSV = async (type: 'items' | 'notes') => {
        try {
            setBusy(prev => ({ ...prev, [type]: true }));
            const res = type === 'items' ? await importItemsCsv() : await importNotesCsv();
            if (!res) return; // canceled
            if (type === 'items') {
                showToast(`Tasks imported • ${res.created} created, ${res.updated} updated`, 'success');
            } else {
                showToast(`Notes imported • ${res.created} created, ${res.updated} updated`, 'success');
            }
        } catch (e) {
            showToast(e instanceof Error ? e.message : 'Import failed', 'error');
        } finally {
            setBusy(prev => ({ ...prev, [type]: false }));
        }
    };

    return (
        <ScreenLayout>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{'Import and export'}</Text>

                <View style={[styles.row, { borderLeftColor: '#4caf50' }]}>
                    <View style={styles.rowLeft}>
                        <FileText size={20} color={'#4caf50'} />
                        <View style={styles.rowText}>
                            <Text style={styles.rowTitle}>{'Tasks'}</Text>
                            <Text style={styles.rowSubtitle}>{'Tasks as CSV'}</Text>
                        </View>
                    </View>

                    <View style={styles.rowActions}>
                        <Pressable
                            disabled={Boolean(busy.items)}
                            onPress={() => handleExportCSV('items')}
                            style={({ pressed }) => [
                                styles.smallButton,
                                styles.outlineButton,
                                { opacity: pressed ? 0.7 : 1 },
                                busy.items && styles.disabled,
                            ]}
                        >
                            {busy.items ? (
                                <ActivityIndicator size={'small'} />
                            ) : (
                                <Download size={16} color={'#fff'} />
                            )}
                            <Text style={styles.smallButtonText}>{'Export'}</Text>
                        </Pressable>

                        <Pressable
                            disabled={Boolean(busy.items)}
                            onPress={() => handleImportCSV('items')}
                            style={({ pressed }) => [
                                styles.smallButton,
                                { opacity: pressed ? 0.7 : 1 },
                                busy.items && styles.disabled,
                            ]}
                        >
                            {busy.items ? (
                                <ActivityIndicator size={'small'} />
                            ) : (
                                <Upload size={16} color={'#fff'} />
                            )}
                            <Text style={styles.smallButtonText}>{'Import'}</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={[styles.row, { borderLeftColor: '#ff9800' }]}>
                    <View style={styles.rowLeft}>
                        <FileText size={20} color={'#ff9800'} />
                        <View style={styles.rowText}>
                            <Text style={styles.rowTitle}>{'Notes'}</Text>
                            <Text style={styles.rowSubtitle}>{'Notes as CSV'}</Text>
                        </View>
                    </View>

                    <View style={styles.rowActions}>
                        <Pressable
                            disabled={Boolean(busy.notes)}
                            onPress={() => handleExportCSV('notes')}
                            style={({ pressed }) => [
                                styles.smallButton,
                                styles.outlineButton,
                                { borderColor: '#ff9800' },
                                { opacity: pressed ? 0.7 : 1 },
                                busy.notes && styles.disabled,
                            ]}
                        >
                            {busy.notes ? (
                                <ActivityIndicator size={'small'} />
                            ) : (
                                <Download size={16} color={'#fff'} />
                            )}
                            <Text style={styles.smallButtonText}>{'Export'}</Text>
                        </Pressable>

                        <Pressable
                            disabled={Boolean(busy.notes)}
                            onPress={() => handleImportCSV('notes')}
                            style={({ pressed }) => [
                                styles.smallButton,
                                { backgroundColor: '#ff9800' },
                                { opacity: pressed ? 0.7 : 1 },
                                busy.notes && styles.disabled,
                            ]}
                        >
                            {busy.notes ? (
                                <ActivityIndicator size={'small'} />
                            ) : (
                                <Upload size={16} color={'#fff'} />
                            )}
                            <Text style={styles.smallButtonText}>{'Import'}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ccc',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 4,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
        paddingRight: 10,
    },
    rowText: {
        flex: 1,
    },
    rowTitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 2,
    },
    rowSubtitle: {
        color: '#888',
        fontSize: 12,
    },
    rowActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    smallButton: {
        height: 36,
        paddingHorizontal: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#4caf50',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#4caf50',
    },
    smallButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 13,
    },
    disabled: {
        opacity: 0.6,
    },
    hint: {
        color: '#666',
        fontSize: 12,
        lineHeight: 16,
        marginTop: 8,
    },
});
