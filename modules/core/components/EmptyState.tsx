import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

type Props = {
    text: string;
};

export const EmptyState = ({ text }: Props) => {
    return (
        <View style={styles.empty}>
            <Text style={styles.emptyText}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    empty: {
        alignItems: 'center',
        marginTop: 30,
    },
    emptyText: {
        color: theme.colors.textSecondary,
        fontSize: 16,
        marginTop: 8,
    },
});
