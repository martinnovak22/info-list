import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
        color: '#666',
        fontSize: 16,
    },
});
