import { Tabs } from 'expo-router';
import React from 'react';
import { CheckSquare, StickyNote, ShoppingCart } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                tabBarStyle: {
                    paddingBottom: 8,
                    paddingTop: 8,
                    backgroundColor: '#121212',
                    borderTopColor: '#333',
                },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#666',
                headerStyle: {
                    backgroundColor: '#121212',
                },
                headerTintColor: '#fff',
            }}>
            <Tabs.Screen
                name="todos"
                options={{
                    title: 'Todos',
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
                name="shopping"
                options={{
                    title: 'Shopping',
                    tabBarIcon: ({ color }) => <ShoppingCart size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
