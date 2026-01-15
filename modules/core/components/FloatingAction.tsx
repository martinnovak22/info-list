import React from 'react';
import { Pressable, StyleSheet, GestureResponderEvent } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { theme } from '../../../modules/core/constants/theme';

interface FloatingActionProps {
    onPress: (event: GestureResponderEvent) => void;
    Icon: LucideIcon;
}

export const FloatingAction: React.FC<FloatingActionProps> = ({ onPress, Icon }) => {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.fab,
                { opacity: pressed ? 0.8 : 1 },
            ]}
        >
            <Icon size={32} color={theme.colors.white} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
});
