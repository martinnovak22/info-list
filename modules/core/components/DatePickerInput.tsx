import React, { useState } from 'react';
import { View, Text, Pressable, Platform, StyleSheet, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar as CalendarIcon, X } from 'lucide-react-native';

type Props = {
    date?: number;
    onDateChange: (date?: number) => void;
    backgroundColor?: string;
    iconColor?: string;
};

export const DatePickerInput = ({ date, onDateChange, backgroundColor = '#333', iconColor = '#fff' }: Props) => {
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

    const formattedDate = date ? new Date(date).toLocaleDateString() : 'Add Date';

    return (
        <View style={styles.container}>
            <Pressable
                onPress={showDatepicker}
                style={[styles.button, { backgroundColor }]}
            >
                <View style={styles.content}>
                    <CalendarIcon size={20} color={iconColor} style={{ marginRight: 8 }} />
                    <Text style={[styles.text, { color: iconColor }]}>
                        {formattedDate}
                    </Text>
                    {date && (
                        <Pressable onPress={clearDate} style={styles.clearButton} hitSlop={10}>
                            <X size={20} color={iconColor} />
                        </Pressable>
                    )}
                </View>


            </Pressable>


            {show && (
                Platform.OS === 'ios' ? (
                    <Modal transparent={true} animationType={"slide"} visible={show}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <DateTimePicker
                                    testID={"dateTimePicker"}
                                    value={date ? new Date(date) : new Date()}
                                    mode={"date"}
                                    display={"inline"}
                                    onChange={onChange}
                                    themeVariant={"dark"}
                                />
                                <Pressable onPress={() => setShow(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>Done</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                ) : (
                    <DateTimePicker
                        testID={"dateTimePicker"}
                        value={date ? new Date(date) : new Date()}
                        mode={"date"}
                        is24Hour={true}
                        onChange={onChange}
                        themeVariant={"dark"}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        minWidth: 140,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 28,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
    },
    clearButton: {
        padding: 4,
        paddingRight: 0,
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
