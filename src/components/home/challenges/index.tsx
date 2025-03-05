import React from 'react';
import { Box, Button, ButtonText } from '@/components/ui';
import { useGetChallenges } from '@/hooks/challenges';
import ChallengeItem from './item';
import ChallengesEmptyState from './empty';
import ChallengesLoadingState from './loading';

const LIMIT = 5;
function ChallengeList() {
  const { data: challenges, isLoading } = useGetChallenges(LIMIT);
  const showEmptyState = !isLoading && !challenges?.length;
  const showLoadingState = isLoading;
  const showViewAllButton =
    !isLoading && challenges && challenges.length >= LIMIT;

  return (
    <Box className="flex flex-col gap-8">
      {showLoadingState && <ChallengesLoadingState />}
      {showEmptyState && <ChallengesEmptyState />}
      {challenges?.map(challenge => (
        <ChallengeItem key={challenge.id} challenge={challenge} />
      ))}

      {showViewAllButton && (
        <Button variant="outline" className="mx-auto w-full max-w-32">
          <ButtonText>View all</ButtonText>
        </Button>
      )}
    </Box>
  );
}

export default ChallengeList;
