import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useEffect, useCallback } from 'react';

export type AuthType = 'BIOMETRICS' | 'DEVICE_PASSCODE' | 'NONE';

export function useLocalAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authType, setAuthType] = useState<AuthType>('NONE');
    const [loading, setLoading] = useState(true);

    const checkAvailability = useCallback(async () => {
        setLoading(true);
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (hasHardware) {
                if (isEnrolled) {
                    setAuthType('BIOMETRICS');
                } else {

                    setAuthType('DEVICE_PASSCODE');
                }
            } else {
                const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
                if (supportedTypes.length > 0) {
                    setAuthType('DEVICE_PASSCODE');
                } else {
                    setAuthType('NONE');
                }
            }

        } catch (e) {
            console.error(e);
            setAuthType('NONE');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAvailability();
    }, [checkAvailability]);

    const authenticate = async () => {
        if (authType === 'NONE') {
            setIsAuthenticated(true);
            return;
        }

        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock Application',
                fallbackLabel: 'Use Passcode',
                disableDeviceFallback: false,
                cancelLabel: 'Cancel'
            });

            if (result.success) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.log('Biometric error:', error);
        }
    };

    return {
        isAuthenticated,
        authType,
        loading,
        authenticate
    };
}
