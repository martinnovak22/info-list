import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function requestNotificationPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        return false;
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return true;
}

export async function scheduleTaskNotification(id: string, title: string, date: number) {
    // Only schedule if date is in the future
    if (date <= Date.now()) return;

    try {
        await Notifications.scheduleNotificationAsync({
            identifier: id,
            content: {
                title: "Task Reminder",
                body: title,
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: new Date(date),
                channelId: Platform.OS === 'android' ? 'default' : undefined,
            },
        });
        console.log(`[Notifications] Scheduled "${title}" for ${new Date(date).toLocaleString()}`);
    } catch (error) {
        console.error('[Notifications] Failed to schedule notification:', error);
    }
}

export async function cancelTaskNotification(id: string) {
    await Notifications.cancelScheduledNotificationAsync(id);
}
