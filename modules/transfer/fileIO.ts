import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

const getExportUri = (filename: string): string => {
    const baseDir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
    if (!baseDir) {
        throw new Error('No writable directory available.');
    }
    return `${baseDir}${filename}`;
};

export const exportCsvFile = async (filename: string, csv: string): Promise<void> => {
    if (Platform.OS === 'android' && FileSystem.StorageAccessFramework) {
        const perms = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!perms.granted) {
            return;
        }

        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            perms.directoryUri,
            filename,
            'text/csv'
        );

        await FileSystem.writeAsStringAsync(fileUri, csv, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        return;
    }

    const uri = getExportUri(filename);

    await FileSystem.writeAsStringAsync(uri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
    });

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {xwxw
        throw new Error('Sharing is not available on this device.');
    }

    await Sharing.shareAsync(uri, {
        mimeType: 'text/csv',
        dialogTitle: filename,
        UTI: 'public.comma-separated-values-text',
    });
};

export const pickCsvAndRead = async (): Promise<{ name: string; content: string } | null> => {
    const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
    });

    if (res.canceled) return null;

    const asset = res.assets?.[0];
    if (!asset?.uri) {
        throw new Error('No file selected.');
    }

    const name = asset.name ?? 'import.csv';
    if (!name.toLowerCase().endsWith('.csv')) {
        throw new Error('Selected file is not a CSV.');
    }

    const content = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.UTF8,
    });

    return {
        name,
        content,
    };
};
