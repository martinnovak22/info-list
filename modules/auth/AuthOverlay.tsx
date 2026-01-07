import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import { useLocalAuth } from './useLocalAuth';
import { Lock } from 'lucide-react-native';

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
            <Lock size={64} color="#fff" />
            <Text style={styles.title}>Locked</Text>
            <Button title="Unlock" onPress={authenticate} color={"black"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 99999,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});
