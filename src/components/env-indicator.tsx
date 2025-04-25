import '../global.css';
import React from 'react';
import 'react-native-reanimated';
import { View } from 'react-native';

import { Text } from '@/components/ui';

export const EnvIndicator = () => {
  const variant = process.env.EXPO_PUBLIC_APP_VARIANT;
  const content = {
    development: '🟢',
    preview: '🟡',
    production: '🔴',
  };

  if (variant === 'production') {
    return null;
  }

  return (
    <View className="absolute right-[20px] top-[50px] z-50 items-center justify-center rounded-full p-1">
      <Text className="text-2xl font-bold text-white">
        {content[variant as keyof typeof content]}
      </Text>
    </View>
  );
};
