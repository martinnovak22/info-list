import React from 'react';
import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import { ScreenLayout } from '../../modules/core/components/ScreenLayout';
import { Download, Upload, FileText } from 'lucide-react-native';
import {exportItemsCsv, exportNotesCsv, importItemsCsv, importNotesCsv} from "../../modules/transfer/transferService";

export default function SettingsScreen() {
    const handleExportCSV = async (type: 'items' | 'notes') => {
        try {
            if (type === 'items') await exportItemsCsv();
            else await exportNotesCsv();
        } catch (e) {
            Alert.alert('Export failed', e instanceof Error ? e.message : 'Unknown error');
        }
    };

    const handleImportCSV = async (type: 'items' | 'notes') => {
        try {
            const res = type === 'items' ? await importItemsCsv() : await importNotesCsv();
            if (!res) return; // canceled
            Alert.alert('Import complete', `Created: ${res.created}\nUpdated: ${res.updated}`);
        } catch (e) {
            Alert.alert('Import failed', e instanceof Error ? e.message : 'Unknown error');
        }
    };

    return (
        <ScreenLayout>
            <Text style={styles.headerTitle}>Settings</Text>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Download size={20} color="#ff9800" />
                    <Text style={styles.sectionTitle}>Local Export</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardText}>Download your data to keep a local copy.</Text>

                    <Pressable style={[styles.button, styles.outlineButton, { marginTop: 12 }]} onPress={() => handleExportCSV('items')}>
                        <FileText size={20} color="#fff" />
                        <Text style={styles.buttonText}>Export Tasks (CSV)</Text>
                    </Pressable>

                    <Pressable style={[styles.button, styles.outlineButton, { marginTop: 12 }]} onPress={() => handleExportCSV('notes')}>
                        <FileText size={20} color="#fff" />
                        <Text style={styles.buttonText}>Export Notes (CSV)</Text>
                    </Pressable>

                    <Text style={[styles.cardText, { marginTop: 16, marginBottom: 8 }]}>Import your data from a CSV file.</Text>
                    <Pressable style={[styles.button, { marginTop: 8 }]} onPress={() => handleImportCSV('items')}>
                        <Upload size={18} color="#fff" />
                        <Text style={styles.buttonText}>Import Tasks (CSV)</Text>
                    </Pressable>

                    <Pressable style={[styles.button, { marginTop: 8 }]} onPress={() => handleImportCSV('notes')}>
                        <Upload size={18} color="#fff" />
                        <Text style={styles.buttonText}>Import Notes (CSV)</Text>
                    </Pressable>
                </View>
            </View>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    card: {
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    cardText: {
        color: '#ccc',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#4caf50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#4caf50',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
