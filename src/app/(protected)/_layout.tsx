import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="onboard" />
      <Stack.Screen name="paywall" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
