
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useStore } from '../../../modules/core/store';
import { ShoppingItem } from '../../../modules/shopping/components/ShoppingItem';
import { useState } from 'react';
import { Plus } from 'lucide-react-native';
import { ScreenLayout } from '../../../modules/core/components/ScreenLayout';
import { DatePickerInput } from '../../../modules/core/components/DatePickerInput';
import { EmptyState } from '../../../modules/core/components/EmptyState';

export default function ShoppingListScreen() {
    const { shoppingList, addShoppingItem, toggleShoppingItem, deleteShoppingItem } = useStore();
    const [text, setText] = useState('');
    const [dueDate, setDueDate] = useState<number | undefined>();

    const handleAdd = () => {
        if (text.trim()) {
            addShoppingItem(text.trim(), dueDate);
            setText('');
            setDueDate(undefined);
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
                    <EmptyState text="No items to buy" />
                }
            />

            <KeyboardAvoidingView
                behavior={"padding"}
                keyboardVerticalOffset={120}
                style={styles.inputContainer}
            >
                <DatePickerInput
                    date={dueDate}
                    onDateChange={setDueDate}
                    backgroundColor="#FF9800"
                    iconColor="#000"
                />
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
        </ScreenLayout >
    );
}

const styles = StyleSheet.create({
    list: {
        paddingBottom: 100,
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
