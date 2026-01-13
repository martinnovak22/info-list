import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { ScreenLayout } from '../../../modules/core/components/ScreenLayout';
import { Upload, Download } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { generateSyncCode, uploadSyncData, downloadSyncData } from '../../../modules/sync/syncService';
import { useToastStore } from '../../../modules/core/store/toastStore';

export default function SyncScreen() {
    const router = useRouter();
    const { showToast } = useToastStore();

    // Generator state
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Receiver state
    const [inputCode, setInputCode] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);

    const handleGenerateCode = async () => {
        setIsGenerating(true);
        try {
            const code = generateSyncCode();
            await uploadSyncData(code);
            setGeneratedCode(code);
            showToast('Code generated. Valid for 10 minutes.', 'success');
        } catch (e) {
            console.error(e);
            showToast('Failed to generate code', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSync = async () => {
        if (!inputCode || inputCode.length !== 6) {
            showToast('Please enter a valid 6-digit code', 'error');
            return;
        }

        setIsSyncing(true);
        try {
            const result = await downloadSyncData(inputCode);
            if (result) {
                const totalCreated = result.itemsCreated + result.notesCreated;
                const totalUpdated = result.itemsUpdated + result.notesUpdated;

                Alert.alert(
                    'Sync Complete',
                    `Successfully synced data!\n\nNew items: ${result.itemsCreated}\nUpdated items: ${result.itemsUpdated}\nNew notes: ${result.notesCreated}\nUpdated notes: ${result.notesUpdated}`,
                    [{ text: 'OK', onPress: () => router.back() }]
                );
            } else {
                showToast('Invalid code or data not found', 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('Sync failed error', 'error');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <ScreenLayout>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <View style={styles.section}>
                        <View style={styles.iconContainer}>
                            <Upload size={32} color="#4caf50" />
                        </View>
                        <Text style={styles.sectionTitle}>Send Data</Text>
                        <Text style={styles.sectionDescription}>
                            Generate a code to transfer your data to another device.
                        </Text>

                        {generatedCode ? (
                            <View style={styles.codeContainer}>
                                <Text style={styles.codeLabel}>Your Sync Code:</Text>
                                <Text style={styles.codeValue}>{generatedCode}</Text>
                                <Text style={styles.codeInstruction}>Enter this code on the other device.</Text>
                            </View>
                        ) : (
                            <Pressable
                                style={styles.actionButton}
                                onPress={handleGenerateCode}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.actionButtonText}>Generate Code</Text>
                                )}
                            </Pressable>
                        )}
                    </View>

                    <View style={styles.divider}>
                        <Text style={styles.dividerText}>OR</Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.iconContainer}>
                            <Download size={32} color="#2196f3" />
                        </View>
                        <Text style={styles.sectionTitle}>Receive Data</Text>
                        <Text style={styles.sectionDescription}>
                            Enter the code from another device to sync data here.
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter 6-digit code"
                            placeholderTextColor="#666"
                            keyboardType="number-pad"
                            maxLength={6}
                            value={inputCode}
                            onChangeText={setInputCode}
                        />

                        <Pressable
                            style={[styles.actionButton, styles.syncButton]}
                            onPress={handleSync}
                            disabled={isSyncing}
                        >
                            {isSyncing ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.actionButtonText}>Sync Now</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </ScreenLayout >
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 24,
    },
    content: {
        flex: 1,
        gap: 24,
    },
    section: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a2a2a',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#2a2a2a',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    actionButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    syncButton: {
        backgroundColor: '#2196f3',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    codeContainer: {
        alignItems: 'center',
        width: '100%',
        padding: 16,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4caf50',
    },
    codeLabel: {
        color: '#888',
        fontSize: 14,
        marginBottom: 8,
    },
    codeValue: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 4,
    },
    codeInstruction: {
        color: '#4caf50',
        fontSize: 12,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dividerText: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 14,
        backgroundColor: '#121212',
        paddingHorizontal: 12,
    },
    input: {
        width: '100%',
        backgroundColor: '#2a2a2a',
        color: '#fff',
        padding: 12,
        borderRadius: 8,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333',
        letterSpacing: 2,
    },
});
