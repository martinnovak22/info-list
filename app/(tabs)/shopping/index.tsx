
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useStore } from '../../../modules/core/store';
import { ShoppingItem } from '../../../modules/shopping/components/ShoppingItem';
import { useState } from 'react';
import { Plus } from 'lucide-react-native';
import { ScreenLayout } from '../../../modules/core/components/ScreenLayout';

export default function ShoppingListScreen() {
    const { shoppingList, addShoppingItem, toggleShoppingItem, deleteShoppingItem } = useStore();
    const [text, setText] = useState('');

    const handleAdd = () => {
        if (text.trim()) {
            addShoppingItem(text.trim());
            setText('');
        }
    };

    return (
        <ScreenLayout>
            <FlatList
                data={shoppingList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ShoppingItem item={item} onToggle={toggleShoppingItem} onDelete={deleteShoppingItem} />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No items to buy</Text>
                    </View>
                }
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.input}
                    placeholder="New Item..."
                    placeholderTextColor="#666"
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={handleAdd}
                />
                <Pressable
                    onPress={handleAdd}
                    disabled={!text.trim()}
                    style={({ pressed }) => [styles.addButton, { opacity: pressed ? 0.7 : (text.trim() ? 1 : 0.5) }]}
                >
                    <Plus size={24} color="#000" />
                </Pressable>
            </KeyboardAvoidingView>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    list: {
        paddingBottom: 100,
    },
    empty: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
    inputContainer: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        color: '#fff',
        padding: 16,
        borderRadius: 50,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#FF9800',
    },
    addButton: {
        backgroundColor: '#FF9800',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
