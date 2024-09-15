import { Tabs } from 'expo-router';
import React, { useContext } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { HomeIcon, User } from 'lucide-react-native';
import { ThemeContext } from '../../_layout';

export default function TabLayout() {
  const { isDark } = useContext(ThemeContext);

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
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabBarIcon icon={HomeIcon} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon icon={User} color={color} />,
        }}
      />
    </Tabs>
  );
}
