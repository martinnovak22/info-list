import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useEffect } from 'react';
import { AppState } from 'react-native';

export function useBiometrics() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
        })();
    }, []);

    const authenticate = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock Application',
                fallbackLabel: 'Use Passcode',
            });
            if (result.success) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.log('Biometric error:', error);
        }
    };

    return { isAuthenticated, isBiometricSupported, authenticate };
}
