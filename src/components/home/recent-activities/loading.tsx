import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonText } from '@/components/ui/skeleton';

const RecentActivitiesLoadingState = () => {
  return (
    <VStack space="2xl">
      <ActivitySkeleton />
      <ActivitySkeleton />
      <ActivitySkeleton />
    </VStack>
  );
};

function ActivitySkeleton() {
  return (
    <Box className="flex flex-row items-start justify-between gap-4">
      <Box className="flex flex-1 flex-row items-center justify-between gap-4">
        <Skeleton variant="circular" className="h-12 w-12" />

        <SkeletonText _lines={2} gap={1} className="h-4 w-2/5" />
      </Box>
      <Box className="flex flex-row items-center justify-between gap-4">
        <Skeleton className="h-4 w-20" />
      </Box>
    </Box>
  );
}

export default RecentActivitiesLoadingState;
