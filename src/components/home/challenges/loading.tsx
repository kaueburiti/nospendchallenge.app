import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ChallengesLoadingState = () => {
  return (
    <VStack space="2xl">
      <ChallengeSkeleton />
      <ChallengeSkeleton />
      <ChallengeSkeleton />
    </VStack>
  );
};

function ChallengeSkeleton() {
  return (
    <Box className="flex flex-row items-start justify-between gap-4">
      <Box className="flex flex-1 flex-row items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-md" />
        <Box className="flex flex-col gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-7 w-64 rounded-xl" />
        </Box>
      </Box>
    </Box>
  );
}

export default ChallengesLoadingState;
