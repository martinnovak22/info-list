import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface ScreenLayoutProps extends ViewProps {
    children: React.ReactNode;
}

export const ScreenLayout = ({ children, style, ...props }: ScreenLayoutProps) => {
    return (
        <View style={[styles.container, style]} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingHorizontal: 16,
        paddingTop: 24,
    },
});
