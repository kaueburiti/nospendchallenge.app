import React from 'react';
import { Box, Button, ButtonText } from '@/components/ui';
import { useGetChallenges } from '@/hooks/challenges';
import ChallengeItem from './item';
import ChallengesEmptyState from './empty';
import ChallengesLoadingState from './loading';

function ChallengeList() {
  const { data: challenges, isLoading } = useGetChallenges(3);
  const showEmptyState = !isLoading && challenges?.length === 0;
  const showLoadingState = isLoading;

  return (
    <Box className="flex flex-col gap-8">
      {showLoadingState && <ChallengesLoadingState />}
      {showEmptyState && <ChallengesEmptyState />}
      {challenges?.map(challenge => (
        <ChallengeItem key={challenge.id} challenge={challenge} />
      ))}

      <Button variant="outline" className="mx-auto w-full max-w-32">
        <ButtonText>View all</ButtonText>
      </Button>
    </Box>
  );
}

export default ChallengeList;
