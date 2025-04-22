import '../global.css';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SessionProvider } from '@/provider/SessionProvider';
import { RevenueCatProvider } from '@/provider/RevenueCatProvider';
import { useDeepLink } from '@/hooks/useDeepLink';
import { ThemeProvider } from '@/provider/ThemeProvider';
import '../sentry';
import '../i18n';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Spinner } from '@/components/ui/spinner';
import { Box } from '@/components/ui';
import { OneSignal, LogLevel } from 'react-native-onesignal';

export { ErrorBoundary } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useDeepLink();
  const [queryClient] = useState(() => new QueryClient());
  const [isReady, setIsReady] = useState(false);

  const [loaded] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      // Add a small delay to ensure the root layout is mounted
      const timer = setTimeout(() => {
        setIsReady(true);
        void SplashScreen.hideAsync();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  // Initialize OneSignal in useEffect to ensure it runs only once
  useEffect(() => {
    // Enable verbose logging for debugging (remove in production)
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    // Initialize with your OneSignal App ID
    OneSignal.initialize(process.env.EXPO_PUBLIC_ONE_SIGNAL_APP_ID!);
    // Use this method to prompt for push notifications.
    // We recommend removing this method after testing and instead use In-App Messages to prompt for notification permission.
    OneSignal.Notifications.requestPermission(false);
  }, []); // Ensure this only runs once on app mount

  if (!loaded || !isReady) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Spinner size="large" color="$gray500" />
      </Box>
    );
  }

  console.log(process.env.EXPO_PUBLIC_SUPABASE_URL);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <RevenueCatProvider>
            <ThemeProvider>
              <Slot />
            </ThemeProvider>
          </RevenueCatProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
