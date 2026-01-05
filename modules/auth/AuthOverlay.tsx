import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import { useBiometrics } from './useBiometrics';
import { Lock } from 'lucide-react-native';

export function AuthOverlay({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isBiometricSupported, authenticate } = useBiometrics();
    const [hasAttempted, setHasAttempted] = React.useState(false);

    useEffect(() => {
        if (isBiometricSupported && !isAuthenticated && !hasAttempted) {
            setHasAttempted(true);
            authenticate();
        }
    }, [isBiometricSupported, isAuthenticated, hasAttempted]);

    // If biometrics not supported, bypass for now (or implement PIN later)
    if (!isBiometricSupported) {
        return <>{children}</>;
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <View style={styles.container}>
            <Lock size={64} color="#fff" />
            <Text style={styles.title}>Locked</Text>
            <Button title="Unlock" onPress={authenticate} color="#fff" />
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
