import React from 'react';
import { Box, Button, ButtonText } from '@/components/ui';
import { useGetChallenges } from '@/hooks/challenges';
import ChallengeItem from './item';
import ChallengesEmptyState from './empty';
import ChallengesLoadingState from './loading';
import { router } from 'expo-router';

const CHALLENGE_LIST_LIMIT = 50;
interface ChallengeListProps {
  limit?: number;
}

function ChallengeList({ limit = CHALLENGE_LIST_LIMIT }: ChallengeListProps) {
  const { data: challenges, isLoading } = useGetChallenges(limit);
  const showEmptyState = !isLoading && !challenges?.length;
  const showLoadingState = isLoading;
  const showViewAllButton =
    !isLoading && challenges && challenges.length >= limit;

  return (
    <Box className="flex flex-col gap-8">
      {showLoadingState && <ChallengesLoadingState />}
      {showEmptyState && <ChallengesEmptyState />}
      {challenges?.map(challenge => (
        <ChallengeItem key={challenge.id} challenge={challenge} />
      ))}

      {showViewAllButton && (
        <Button
          variant="outline"
          className="mx-auto w-full max-w-32"
          onPress={() => router.push('/(protected)/(tabs)/challenges')}>
          <ButtonText>View all</ButtonText>
        </Button>
      )}
    </Box>
  );
}

export default ChallengeList;
