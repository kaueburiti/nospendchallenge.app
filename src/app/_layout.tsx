import '../global.css';
import { GluestackUIProvider } from '../components/ui/gluestack-ui-provider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SessionProvider } from '@/provider/SessionProvider';
import { RevenueCatProvider } from '@/provider/RevenueCatProvider';
import * as Sentry from '@sentry/react-native';
import { useDeepLink } from '@/hooks/useDeepLink';
import { initializeOneSignal } from '@/lib/one-signal';
import { Env } from '@/lib/env';
import { PostHogProvider } from 'posthog-react-native';
import config from '../../config';

Env.SENTRY_DSN && Sentry.init({
  dsn: Env.SENTRY_DSN
  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();
const defaultTheme: 'dark' | 'light' = 'light';

type ThemeContextType = {
  colorMode?: 'dark' | 'light';
  isDark?: boolean;
  toggleColorMode?: () => void;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  colorMode: 'dark',
  isDark: false,
  toggleColorMode: undefined,
});

export default function RootLayout() {
  useDeepLink();
  const [colorMode, setColorMode] = React.useState<'dark' | 'light'>(
    defaultTheme,
  );

  const toggleColorMode = () => {
    setColorMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = colorMode === 'dark';

  const [loaded] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    void initializeOneSignal()
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <RevenueCatProvider>
          <PostHogProvider apiKey={Env.POSTHOG_API_KEY} options={{
            host: config.posthogHost,
          }}>
          <ThemeContext.Provider value={{ colorMode, toggleColorMode, isDark }}>
            <GluestackUIProvider mode={colorMode}>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}>
                <Stack.Screen name="(protected)" />
                <Stack.Screen name="(public)" />
              </Stack>
            </GluestackUIProvider>
          </ThemeContext.Provider>
            </PostHogProvider>
        </RevenueCatProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
