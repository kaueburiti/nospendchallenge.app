import React from 'react';
import { Box } from '@/components/ui';
import { useGetChallenges } from '@/hooks/challenges';
import ChallengeItem from './item';
import ChallengesEmptyState from './empty';
import ChallengesLoadingState from './loading';

const CHALLENGE_LIST_LIMIT = 50;
interface ChallengeListProps {
  limit?: number;
}

function ChallengeList({ limit = CHALLENGE_LIST_LIMIT }: ChallengeListProps) {
  const { data: challenges, isLoading } = useGetChallenges(limit);
  const showEmptyState = !isLoading && !challenges?.length;
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
