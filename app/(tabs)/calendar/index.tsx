import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useStore } from '../../../modules/core/store';
import { ScreenLayout } from '../../../modules/core/components/ScreenLayout';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { ShoppingBag, CheckSquare, StickyNote } from 'lucide-react-native';

export default function CalendarScreen() {
    const { todos, notes, shoppingList } = useStore();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const markedDates = useMemo(() => {
        const marks: any = {};

        // Helper to add marks
        const addMark = (date: number | undefined, color: string) => {
            if (!date) return;
            const dateStr = new Date(date).toISOString().split('T')[0];
            if (!marks[dateStr]) {
                marks[dateStr] = { dots: [] };
            }
            // Avoid duplicate colors for same day
            if (!marks[dateStr].dots.find((d: any) => d.color === color)) {
                marks[dateStr].dots.push({ color });
            }
        };

        todos.forEach(t => addMark(t.dueDate, '#4caf50')); // Green for todos
        notes.forEach(n => addMark(n.dueDate, '#ffeb3b')); // Yellow for notes
        shoppingList.forEach(i => addMark(i.dueDate, '#ff9800')); // Orange for shopping

        // Highlight selected date
        if (marks[selectedDate]) {
            marks[selectedDate].selected = true;
            marks[selectedDate].selectedColor = '#333';
        } else {
            marks[selectedDate] = { selected: true, selectedColor: '#333', dots: [] };
        }

        return marks;
    }, [todos, notes, shoppingList, selectedDate]);

    const itemsForSelectedDate = useMemo(() => {
        const startOfDay = new Date(selectedDate).setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate).setHours(23, 59, 59, 999);

        const isSameDay = (timestamp?: number) => {
            if (!timestamp) return false;
            return timestamp >= startOfDay && timestamp <= endOfDay;
        };

        return [
            ...todos.filter(t => isSameDay(t.dueDate)).map(t => ({ ...t, type: 'todo' })),
            ...notes.filter(n => isSameDay(n.dueDate)).map(n => ({ ...n, type: 'note' })),
            ...shoppingList.filter(s => isSameDay(s.dueDate)).map(s => ({ ...s, type: 'shopping' })),
        ];
    }, [selectedDate, todos, notes, shoppingList]);

    const renderItem = ({ item }: { item: any }) => {
        let icon;
        let color;
        if (item.type === 'todo') {
            icon = <CheckSquare size={20} color={"#4caf50"} />;
            color = "#4caf50";
        } else if (item.type === 'note') {
            icon = <StickyNote size={20} color={"#ffeb3b"} />;
            color = "#ffeb3b";
        } else {
            icon = <ShoppingBag size={20} color={"#ff9800"} />;
            color = "#ff9800";
        }

        return (
            <View style={[styles.item, { borderLeftColor: color }]}>
                {icon}
                <Text style={styles.itemText}>{item.text || item.title}</Text>
            </View>
        );
    };

    return (
        <ScreenLayout>
            <Calendar
                onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
                markedDates={markedDates}
                markingType={'multi-dot'}
                theme={{
                    calendarBackground: 'transparent',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    dayTextColor: '#d9e1e8',
                    textDisabledColor: '#2d4150',
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    arrowColor: 'white',
                    monthTextColor: 'white',
                    indicatorColor: 'white',
                }}
            />
            <View style={styles.listContainer}>
                <Text style={styles.header}>Items for {selectedDate}</Text>
                <FlatList
                    data={itemsForSelectedDate}
                    keyExtractor={(item) => item.id + item.type}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.emptyText}>No items for this date</Text>}
                />
            </View>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#1E1E1E',
        marginBottom: 8,
        borderRadius: 8,
        gap: 12,
        borderLeftWidth: 4,
    },
    itemText: {
        color: '#fff',
        fontSize: 16,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
});
