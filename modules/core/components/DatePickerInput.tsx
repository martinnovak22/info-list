import React, { useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar as CalendarIcon, X } from 'lucide-react-native';

type Props = {
    date?: number;
    onDateChange: (date?: number) => void;
    backgroundColor?: string;
    iconColor?: string;
    showDate?: boolean;
};

export const DatePickerInput = ({ showDate = false, date, onDateChange, backgroundColor = '#333', iconColor = '#fff' }: Props) => {
    const [show, setShow] = useState(false);

    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate;
        if (Platform.OS === 'android') {
            setShow(false);
        }
        if (currentDate) {
            onDateChange(currentDate.getTime());
        }
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const clearDate = () => {
        onDateChange(undefined);
    };

    const formattedDate = date ? new Date(date).toLocaleDateString() : null;

    return (
        <View style={styles.container}>
            <Pressable
                onPress={date ? clearDate : showDatepicker}
                style={[styles.button, showDate ? styles.dateButton : undefined, { backgroundColor }]}
            >
                {date ? (
                    showDate ? (
                        <View style={styles.dateContent}>
                            <CalendarIcon size={20} color={iconColor} style={{ marginRight: 8 }} />
                            <Text style={[styles.dateText, { color: iconColor }]}>{formattedDate}</Text>
                            <X size={20} color={iconColor} style={{ marginLeft: 8 }} />
                        </View>
                    ) : (
                        <X size={24} color={iconColor} />
                    )
                ) : (
                    showDate ? (
                        <View style={styles.dateContent}>
                            <CalendarIcon size={24} color={iconColor} style={{ marginRight: 8 }} />
                            <Text style={[styles.dateText, { color: iconColor }]}>Add Date</Text>
                        </View>
                    ) : (
                        <CalendarIcon size={24} color={iconColor} />
                    )
                )}
            </Pressable>


            {show && (
                Platform.OS === 'ios' ? (
                    <Modal transparent={true} animationType="slide" visible={show}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date ? new Date(date) : new Date()}
                                    mode="date"
                                    display="inline"
                                    onChange={onChange}
                                    themeVariant="dark"
                                    style={styles.picker}
                                />
                                <Pressable onPress={() => setShow(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>Done</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                ) : (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date ? new Date(date) : new Date()}
                        mode="date"
                        is24Hour={true}
                        onChange={onChange}
                        themeVariant="dark"
                    />
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateButton: {
        width: 'auto',
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    dateContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        paddingBottom: 32,
        alignItems: 'center',
    },
    picker: {
        width: '100%',
    },
    closeButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#333',
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
