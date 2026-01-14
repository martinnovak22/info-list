import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { ScreenLayout } from '../../../modules/core/components/ScreenLayout';
import { Download, Upload, FileText, Bell, Palette, Info, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { exportItemsCsv, exportNotesCsv, importItemsCsv, importNotesCsv } from "../../../modules/transfer/transferService";
import { useToastStore } from '../../../modules/core/store/toastStore';
import { useStore } from '../../../modules/core/store/store';
import { theme } from '../../../modules/core/constants/theme';

export default function SettingsScreen() {
    const router = useRouter();
    const [busy, setBusy] = React.useState<{ items?: boolean; notes?: boolean }>({});
    const { showToast } = useToastStore();

    const autoDeleteFinishedEnabled = useStore((state) => state.autoDeleteFinishedEnabled);
    const autoDeleteFinishedAfterDays = useStore((state) => state.autoDeleteFinishedAfterDays);
    const setAutoDeleteFinishedEnabled = useStore((state) => state.setAutoDeleteFinishedEnabled);
    const setAutoDeleteFinishedAfterDays = useStore((state) => state.setAutoDeleteFinishedAfterDays);
    const cleanupFinishedItems = useStore((state) => state.cleanupFinishedItems);

    const items = useStore((state) => state.items);
    const notes = useStore((state) => state.notes);
    const tags = useStore((state) => state.tags);

    const tasksTotal = items.length;
    const notesTotal = notes.length;
    const tagsTotal = tags.length;

    const tasksDone = React.useMemo(
        () => items.reduce((acc, i) => acc + (i.completed ? 1 : 0), 0),
        [items]
    );

    React.useEffect(() => {
        if (autoDeleteFinishedEnabled) {
            cleanupFinishedItems();
        }
    }, [autoDeleteFinishedEnabled, autoDeleteFinishedAfterDays, cleanupFinishedItems]);

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
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{'Overview'}</Text>

                    <View style={styles.grid}>
                        <View style={styles.tile}>
                            <Text style={styles.tileValue}>{String(tasksTotal)}</Text>
                            <Text style={styles.tileLabel}>{'Tasks'}</Text>
                        </View>

                        <View style={styles.tile}>
                            <Text style={styles.tileValue}>{String(tasksDone)}</Text>
                            <Text style={styles.tileLabel}>{'Completed'}</Text>
                        </View>

                        <View style={styles.tile}>
                            <Text style={styles.tileValue}>{String(notesTotal)}</Text>
                            <Text style={styles.tileLabel}>{'Notes'}</Text>
                        </View>

                        <View style={styles.tile}>
                            <Text style={styles.tileValue}>{String(tagsTotal)}</Text>
                            <Text style={styles.tileLabel}>{'Tags'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{'Quick actions'}</Text>

                    <View style={[styles.row, { borderLeftColor: theme.colors.info }]}>
                        <View style={styles.rowLeft}>
                            <Bell size={20} color={theme.colors.info} />
                            <View style={styles.rowText}>
                                <Text style={styles.rowTitle}>{'Notifications'}</Text>
                                <Text style={styles.rowSubtitle}>{'Coming soon'}</Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={() => showToast('Coming soon', 'info')}
                            style={({ pressed }) => [
                                styles.smallButton,
                                styles.outlineButton,
                                { borderColor: theme.colors.info },
                                { opacity: pressed ? 0.7 : 1 },
                            ]}
                        >
                            <Text style={styles.smallButtonText}>{'Open'}</Text>
                        </Pressable>
                    </View>

                    <View style={[styles.row, { borderLeftColor: theme.palette.purple }]}>
                        <View style={styles.rowLeft}>
                            <Palette size={20} color={theme.palette.purple} />
                            <View style={styles.rowText}>
                                <Text style={styles.rowTitle}>{'Appearance'}</Text>
                                <Text style={styles.rowSubtitle}>{'Coming soon'}</Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={() => showToast('Coming soon', 'info')}
                            style={({ pressed }) => [
                                styles.smallButton,
                                styles.outlineButton,
                                { borderColor: theme.palette.purple },
                                { opacity: pressed ? 0.7 : 1 },
                            ]}
                        >
                            <Text style={styles.smallButtonText}>{'Open'}</Text>
                        </Pressable>
                    </View>

                    <View style={[styles.row, { borderLeftColor: theme.colors.iconSecondary }]}>
                        <View style={styles.rowLeft}>
                            <Info size={20} color={theme.colors.iconSecondary} />
                            <View style={styles.rowText}>
                                <Text style={styles.rowTitle}>{'About'}</Text>
                                <Text style={styles.rowSubtitle}>{'Coming soon'}</Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={() => showToast('Coming soon', 'info')}
                            style={({ pressed }) => [
                                styles.smallButton,
                                styles.outlineButton,
                                { borderColor: theme.colors.iconSecondary },
                                { opacity: pressed ? 0.7 : 1 },
                            ]}
                        >
                            <Text style={styles.smallButtonText}>{'Open'}</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{'Finished cleanup'}</Text>

                    <View style={[styles.row, { borderLeftColor: theme.colors.error }]}>
                        <View style={styles.rowLeft}>
                            <FileText size={20} color={theme.colors.error} />
                            <View style={styles.rowText}>
                                <Text style={styles.rowTitle}>{'Auto-delete finished'}</Text>
                                <Text style={styles.rowSubtitle}>{'Remove finished tasks after a delay'}</Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={() => {
                                const next = !autoDeleteFinishedEnabled;
                                setAutoDeleteFinishedEnabled(next);
                                if (next) {
                                    cleanupFinishedItems();
                                    showToast('Auto-delete enabled', 'success');
                                } else {
                                    showToast('Auto-delete disabled', 'info');
                                }
                            }}
                            style={({ pressed }) => [
                                styles.smallButton,
                                styles.outlineButton,
                                { borderColor: theme.colors.error },
                                { opacity: pressed ? 0.7 : 1 },
                            ]}
                        >
                            <Text style={[styles.smallButtonText, { color: theme.colors.error }]}>
                                {autoDeleteFinishedEnabled ? 'ON' : 'OFF'}
                            </Text>
                        </Pressable>
                    </View>

                    <View style={[styles.row, { borderLeftColor: theme.colors.iconSecondary }]}>
                        <View style={styles.rowLeft}>
                            <FileText size={20} color={theme.colors.textSecondary} />
                            <View style={styles.rowText}>
                                <Text style={styles.rowTitle}>{'Delete after'}</Text>
                                <Text style={styles.rowSubtitle}>{`${autoDeleteFinishedAfterDays} day${autoDeleteFinishedAfterDays === 1 ? '' : 's'}`}</Text>
                            </View>
                        </View>

                        <View style={styles.rowActions}>
                            {[1, 7, 30, 90].map((days) => {
                                const selected = autoDeleteFinishedAfterDays === days;
                                return (
                                    <Pressable
                                        key={days}
                                        disabled={!autoDeleteFinishedEnabled}
                                        onPress={() => {
                                            setAutoDeleteFinishedAfterDays(days);
                                            showToast(`Auto-delete set to ${days} day${days === 1 ? '' : 's'}`, 'success');
                                        }}
                                        style={({ pressed }) => [
                                            styles.smallButton,
                                            selected ? undefined : styles.outlineButton,
                                            selected ? { backgroundColor: theme.colors.error } : { borderColor: theme.colors.error },
                                            { opacity: pressed ? 0.7 : 1 },
                                            !autoDeleteFinishedEnabled && styles.disabled,
                                        ]}
                                    >
                                        <Text style={styles.smallButtonText}>{String(days)}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{'Sync'}</Text>

                    <View style={[styles.row, { borderLeftColor: theme.colors.info }]}>
                        <View style={styles.rowLeft}>
                            <RefreshCw size={20} color={theme.colors.info} />
                            <View style={styles.rowText}>
                                <Text style={styles.rowTitle}>{'Sync Data'}</Text>
                                <Text style={styles.rowSubtitle}>{'Transfer data between devices'}</Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={() => router.push('/(tabs)/settings/sync')}
                            style={({ pressed }) => [
                                styles.smallButton,
                                styles.outlineButton,
                                { borderColor: theme.colors.info },
                                { opacity: pressed ? 0.7 : 1 },
                            ]}
                        >
                            <Text style={styles.smallButtonText}>{'Open'}</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{'Import & export'}</Text>

                    <View style={[styles.row, { borderLeftColor: theme.palette.green }]}>
                        <View style={styles.rowLeft}>
                            <FileText size={20} color={theme.palette.green} />
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

                    <View style={[styles.row, { borderLeftColor: theme.palette.orange }]}>
                        <View style={styles.rowLeft}>
                            <FileText size={20} color={theme.palette.orange} />
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
                                    { borderColor: theme.palette.orange },
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
                                    { backgroundColor: theme.palette.orange },
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
            </ScrollView>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 24,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ccc',
        marginBottom: 10,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tile: {
        width: '48%',
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        padding: 14,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
    },
    tileValue: {
        color: theme.colors.white,
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    tileLabel: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        backgroundColor: theme.colors.surface,
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
        color: theme.colors.white,
        fontSize: 16,
        marginBottom: 2,
    },
    rowSubtitle: {
        color: theme.colors.iconSecondary,
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
        backgroundColor: theme.colors.primary,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    smallButtonText: {
        color: theme.colors.white,
        fontWeight: '600',
        fontSize: 13,
    },
    disabled: {
        opacity: 0.6,
    },
});
