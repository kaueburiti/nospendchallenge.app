import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ChallengeChatTab from '@/components/challenge/chat-tab';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChallengeChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <ChallengeChatTab challengeId={id} />
    </SafeAreaView>
  );
}
