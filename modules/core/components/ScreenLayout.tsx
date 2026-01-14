import { View, StyleSheet, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';

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
        backgroundColor: theme.colors.background,
        paddingHorizontal: 16,
        paddingTop: 24,
    },
});
