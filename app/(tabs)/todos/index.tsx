import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useStore } from '../../../modules/core/store';
import { TodoItem } from '../../../modules/todos/components/TodoItem';
import { useState } from 'react';
import { Plus } from 'lucide-react-native';
import { ScreenLayout } from '../../../modules/core/components/ScreenLayout';
import { DatePickerInput } from '../../../modules/core/components/DatePickerInput';
import { EmptyState } from '../../../modules/core/components/EmptyState';

export default function TodoListScreen() {
    const { todos, addTodo, toggleTodo, deleteTodo } = useStore();
    const [text, setText] = useState('');
    const [dueDate, setDueDate] = useState<number | undefined>();

    const handleAdd = () => {
        if (text.trim()) {
            addTodo(text.trim(), dueDate);
            setText('');
            setDueDate(undefined);
        }
    };

    return (
        <ScreenLayout>
            <FlatList
                data={todos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <EmptyState text="No todos yet" />
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
                    backgroundColor="#fff"
                    iconColor="#000"
                />
                <TextInput
                    style={styles.input}
                    placeholder="New Todo..."
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
        borderColor: '#333',
    },
    addButton: {
        backgroundColor: '#fff',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
