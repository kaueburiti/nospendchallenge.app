import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { GluestackUIProvider } from '@/components/ui';
import { config } from '@/components/ui/gluestack-ui-provider/config';

export default function OnboardLayout() {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider config={config} colorMode={colorScheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </GluestackUIProvider>
  );
}
