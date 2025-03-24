import React from 'react';
import { Tabs } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ChallengeLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#6366f1' : '#4f46e5',
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#111827' : '#ffffff',
          borderTopColor: isDark ? '#1f2937' : '#e5e7eb',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('Overview'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
          tabBarLabel: t('Overview'),
        }}
      />
      <Tabs.Screen
        name="participants"
        options={{
          title: t('Participants'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="users" size={size} color={color} />
          ),
          tabBarLabel: t('Participants'),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t('Chat'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
          tabBarLabel: t('Chat'),
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: t('Activities'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="activity" size={size} color={color} />
          ),
          tabBarLabel: t('Activities'),
        }}
      />
    </Tabs>
  );
}
