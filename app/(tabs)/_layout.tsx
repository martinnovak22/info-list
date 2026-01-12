import { Tabs } from 'expo-router';
import React from 'react';
import { CheckSquare, StickyNote, Calendar, Search as SearchIcon, Settings as SettingsIcon } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarStyle: {
                    height: 80,
                    paddingTop: 8,
                    backgroundColor: '#121212',
                    borderTopColor: '#333',
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#666',
                headerStyle: {
                    backgroundColor: '#121212',
                    borderBottomColor: '#333',
                    borderBottomWidth: 1,
                },
                headerTitleAlign: "center",
                headerTintColor: '#fff',
                headerRightContainerStyle: {
                    paddingRight: 8,
                },
                headerLeftContainerStyle: {
                    paddingLeft: 8,
                },
            }}>
            <Tabs.Screen
                name="todos"
                options={{
                    title: 'Tasks',
                    tabBarIcon: ({ color }) => <CheckSquare size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="notes"
                options={{
                    title: 'Notes',
                    tabBarIcon: ({ color }) => <StickyNote size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendar',
                    tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="search/index"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color }) => <SearchIcon size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <SettingsIcon size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
