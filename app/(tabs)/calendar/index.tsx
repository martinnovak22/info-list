import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useStore } from '../../../modules/core/store/store';
import { ScreenLayout } from '../../../modules/core/components/ScreenLayout';
import { theme } from '../../../modules/core/constants/theme';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { ShoppingBag, CheckSquare, StickyNote } from 'lucide-react-native';

export default function CalendarScreen() {
    const { items, notes, tags } = useStore();
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const markedDates = useMemo(() => {
        const marks: any = {};

        const addMark = (date: number | undefined, color: string) => {
            if (!date) return;
            const dateStr = new Date(date).toISOString().split('T')[0];
            if (!marks[dateStr]) {
                marks[dateStr] = { dots: [] };
            }
            if (!marks[dateStr].dots.find((d: any) => d.color === color)) {
                marks[dateStr].dots.push({ color });
            }
        };

        items.forEach(item => {
            const tag = tags.find(t => t.id === item.tagIds[0]);
            const color = tag?.color || theme.colors.white;
            addMark(item.dueDate, color);
        });

        notes.forEach(n => addMark(n.dueDate, theme.palette.orange));

        if (marks[selectedDate]) {
            marks[selectedDate].selected = true;
            marks[selectedDate].selectedColor = theme.colors.border;
        } else {
            marks[selectedDate] = { selected: true, selectedColor: theme.colors.border, dots: [] };
        }

        return marks;
    }, [items, notes, tags, selectedDate]);

    const itemsForSelectedDate = useMemo(() => {
        const startOfDay = new Date(selectedDate).setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate).setHours(23, 59, 59, 999);

        const isSameDay = (timestamp?: number) => {
            if (!timestamp) return false;
            return timestamp >= startOfDay && timestamp <= endOfDay;
        };

        return [
            ...items.filter(i => isSameDay(i.dueDate)).map(i => ({ ...i, type: 'task' })),
            ...notes.filter(n => isSameDay(n.dueDate)).map(n => ({ ...n, type: 'note' })),
        ];
    }, [selectedDate, items, notes]);

    const renderItem = ({ item }: { item: any }) => {
        let icon;
        let color;

        if (item.type === 'task') {
            const tag = tags.find((t: any) => t.id === item.tagIds?.[0]);
            color = tag?.color || theme.colors.white;
            icon = <CheckSquare size={20} color={color} />;
        } else {
            icon = <StickyNote size={20} color={theme.palette.orange} />;
            color = theme.palette.orange;
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
                    textSectionTitleColor: theme.colors.textSecondary,
                    selectedDayBackgroundColor: theme.colors.info,
                    selectedDayTextColor: theme.colors.white,
                    todayTextColor: theme.colors.info,
                    dayTextColor: theme.colors.textDim,
                    textDisabledColor: theme.colors.surfaceHighlight,
                    dotColor: theme.colors.info,
                    selectedDotColor: theme.colors.white,
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
        color: theme.colors.white,
        marginBottom: 12,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: theme.colors.surface,
        marginBottom: 8,
        borderRadius: 8,
        gap: 12,
        borderLeftWidth: 4,
    },
    itemText: {
        color: theme.colors.white,
        fontSize: 16,
    },
    emptyText: {
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: 20,
    },
});
