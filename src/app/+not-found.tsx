import { Stack } from 'expo-router';
import { Text } from '@/components/ui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text>Not found</Text>
    </>
  );
}
