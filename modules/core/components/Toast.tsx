import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Pressable } from 'react-native';
import Animated, { FadeInUp, FadeOutUp, SlideInUp, SlideOutUp, LinearTransition } from 'react-native-reanimated';
import { useToastStore } from '../store/toastStore';
import { theme } from '../constants/theme';
import { CheckCircle, AlertCircle, Info } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Toast = () => {
    const { visible, message, type, action, duration, hideToast } = useToastStore();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                hideToast();
            }, duration || 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, hideToast, duration]);

    const getIcon = React.useCallback(() => {
        switch (type) {
            case 'success': return <CheckCircle size={24} color={theme.colors.primary} />;
            case 'error': return <AlertCircle size={24} color={theme.colors.error} />;
            default: return <Info size={24} color={theme.colors.info} />;
        }
    }, [type]);

    const getBorderColor = React.useCallback(() => {
        switch (type) {
            case 'success': return theme.colors.primary;
            case 'error': return theme.colors.error;
            case 'info': return theme.colors.info;
            default: return theme.colors.info;
        }
    }, [type]);

    const getBackgroundColor = React.useCallback(() => {
        return theme.colors.surfaceHighlight;
    }, []);

    if (!visible) return null;

    const handleAction = () => {
        if (action) {
            hideToast();
            action.onPress();
        }
    };

    return (
        <Animated.View
            entering={FadeInUp.duration(300)}
            exiting={FadeOutUp.duration(300)}
            layout={LinearTransition.duration(300)}
            style={[
                styles.container,
                { top: insets.top + 12, backgroundColor: getBackgroundColor(), borderColor: getBorderColor() }
            ]}
        >
            <View style={styles.content}>
                <View style={styles.messageRow}>
                    <View style={styles.iconContainer}>{getIcon()}</View>
                    <Text style={styles.toastText} numberOfLines={2}>{message}</Text>
                </View>
                {action && (
                    <Pressable
                        onPress={handleAction}
                        style={({ pressed }) => [
                            styles.actionButton,
                            { opacity: pressed ? 0.7 : 1 }
                        ]}
                    >
                        <Text style={styles.actionText}>{action.label}</Text>
                    </Pressable>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        borderRadius: 20,
        padding: 16,
        paddingVertical: 12,
        zIndex: 9999,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 15,
        minHeight: 64,
        justifyContent: 'center',
        borderWidth: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    iconContainer: {
        width: 32,
        alignItems: 'center',
    },
    toastText: {
        color: theme.colors.white,
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    actionButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginLeft: 4,
    },
    actionText: {
        color: theme.colors.info,
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    closeButton: {
        marginLeft: 12,
        padding: 4,
    },
});
