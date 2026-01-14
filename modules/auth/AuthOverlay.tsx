import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useLocalAuth } from './useLocalAuth';
import { Lock } from 'lucide-react-native';
import { theme } from '../../modules/core/constants/theme';

export function AuthOverlay({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, authType, loading, authenticate } = useLocalAuth();
    const [hasAttempted, setHasAttempted] = React.useState(false);

    useEffect(() => {
        if (!loading && authType !== 'NONE' && !isAuthenticated && !hasAttempted) {
            setHasAttempted(true);
            authenticate();
        }
    }, [loading, authType, isAuthenticated, hasAttempted]);

    if (authType === 'NONE') {
        return <>{children}</>;
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <View style={styles.container}>
            <Lock size={64} color={theme.colors.white} />
            <Text style={styles.title}>Locked</Text>
            <Button title="Unlock" onPress={authenticate} color={theme.colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 99999,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    title: {
        color: theme.colors.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
});
