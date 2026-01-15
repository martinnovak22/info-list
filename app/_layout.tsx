import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from 'react-native';
import { AuthOverlay } from '../modules/auth/AuthOverlay';
import { Toast } from '../modules/core/components/Toast';
import { requestNotificationPermissions } from '../modules/core/utils/notifications';


export default function RootLayout() {
    const colorScheme = useColorScheme();

    useEffect(() => {
        // Attempt to hide immediately
        SplashScreen.hideAsync().catch(() => { });

        // Request notification permissions
        requestNotificationPermissions();

        // Safety timeout
        const timeout = setTimeout(() => {
            SplashScreen.hideAsync().catch(() => { });
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);


    // Force Dark Theme as requested by user ("dark like theme") specific preference,
    // but let's stick to system scheme or force dark if heavily requested.
    // User said "Preferably darker colors", let's use DarkTheme by default or custom.

    const isDark = true; // Forcing dark for now as requested

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
                <AuthOverlay>
                    <Stack>
                        <Stack.Screen name={"(tabs)"} options={{ headerShown: false }} />
                        <Stack.Screen name={"+not-found"} />
                    </Stack>
                    <StatusBar style={isDark ? 'light' : 'dark'} />
                    <Toast />
                </AuthOverlay>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
