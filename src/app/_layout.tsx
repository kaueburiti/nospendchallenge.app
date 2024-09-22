import '../global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SessionProvider } from '@/provider/SessionProvider';
import { RevenueCatProvider } from '@/provider/RevenueCatProvider';
import { useDeepLink } from '@/hooks/useDeepLink';
import { initializeOneSignal } from '@/lib/one-signal';
import { ThemeProvider } from "@/provider/ThemeProvider";
import '../sentry';
import { ConditionalPostHogProvider } from '@/provider/ConditionalPostHogProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useDeepLink();

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
          <ConditionalPostHogProvider>
            <ThemeProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}>
                <Stack.Screen name="(protected)" />
                <Stack.Screen name="(public)" />
              </Stack>
            </ThemeProvider>
          </ConditionalPostHogProvider>
        </RevenueCatProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
