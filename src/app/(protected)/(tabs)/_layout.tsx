import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { HomeIcon, TrophyIcon, User, Bot } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';

export default function TabLayout() {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#fff' : '#000',
        headerShown: false,
        tabBarStyle: { backgroundColor: isDark ? '#000' : '#fff' },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: t('home.tab_label'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon icon={HomeIcon} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: t('challenge.tab_label'),
          tabBarIcon: ({ color }) => (
            <TabBarIcon icon={TrophyIcon} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai-assistant"
        options={{
          title: t('ai_assistant.tab_label'),
          tabBarIcon: ({ color }) => <TabBarIcon icon={Bot} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.tab_label'),
          tabBarIcon: ({ color }) => <TabBarIcon icon={User} color={color} />,
        }}
      />
    </Tabs>
  );
}
