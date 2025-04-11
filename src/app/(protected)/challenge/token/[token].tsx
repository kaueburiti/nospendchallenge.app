import React, { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChallenge } from '@/hooks/challenges/useChallenge';
import { useJoinChallenge } from '@/hooks/challenges/useJoinChallenge';
import { Text } from '@/components/ui';
import { useSession } from '@/hooks/useSession';
import Loading from '@/components/home/challenges/loading';
import { View } from 'react-native';

export default function ChallengeDeepLink() {
  console.log('ChallengeDeepLink');
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const { session } = useSession();
  const { data: challenge, isLoading: isLoadingChallenge } =
    useChallenge(token);
  const { mutate: joinChallenge, isPending: isJoining } = useJoinChallenge();

  console.log('challenge', challenge);
  console.log('token', token);

  useEffect(() => {
    if (!token) {
      router.replace('/');
      return;
    }

    if (!session) {
      // Store the token in AsyncStorage to use after login
      // Then redirect to login
      router.replace({
        pathname: '/login',
        params: { challengeToken: token },
      });
      return;
    }

    if (challenge && !isLoadingChallenge) {
      joinChallenge(
        { token },
        {
          onSuccess: () => {
            router.replace({
              pathname: '/challenge/[id]',
              params: { id: challenge.id },
            });
          },
          onError: error => {
            console.error('Failed to join challenge:', error);
            router.replace('/');
          },
        },
      );
    }
  }, [token, session, challenge, isLoadingChallenge]);

  return (
    <View className="flex-1 items-center justify-center">
      {isLoadingChallenge || isJoining ? (
        <Loading />
      ) : (
        <Text className="text-lg">Joining challenge...</Text>
      )}
    </View>
  );
}
