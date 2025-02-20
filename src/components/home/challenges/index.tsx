import React from 'react';
import { Box } from '@/components/ui';
import { useGetChallenges } from '@/hooks/challenges';
import ChallengeItem from './item';
import ChallengesEmptyState from './empty';
import ChallengesLoadingState from './loading';

function ChallengeList() {
  const { data: challenges, isLoading } = useGetChallenges();
  const showEmptyState = !isLoading && challenges?.length === 0;
  const showLoadingState = isLoading;

  return (
    <Box className="flex flex-col gap-8">
      {showLoadingState && <ChallengesLoadingState />}
      {showEmptyState && <ChallengesEmptyState />}
      {challenges?.map(challenge => (
        <ChallengeItem key={challenge.id} challenge={challenge} />
      ))}
    </Box>
  );
}

export default ChallengeList;
