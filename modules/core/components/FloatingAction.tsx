import React from 'react';
import { Pressable, StyleSheet, GestureResponderEvent } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

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
            <Icon size={32} color={'#fff'} />
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
        backgroundColor: '#4caf50',
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
