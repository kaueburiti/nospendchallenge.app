import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui';
import React from 'react';
import { i18n } from '@/i18n';
import { useGetActivities } from '@/hooks/activities';
import RecentActivitiesLoadingState from './loading';
import ActivityItem from './item';
import RecentActivitiesEmptyState from './empty';
const RecentActivities = () => {
  const { data: activities, isLoading } = useGetActivities();
  const showEmptyState = !isLoading && activities?.length === 0;
  const showActivities = !isLoading && !showEmptyState;

  return (
    <Box className="flex flex-1 flex-col pb-8">
      <Heading size="xl" className="mb-4">
        {i18n.t('home.bottom_section_title')}
      </Heading>

      {isLoading && <RecentActivitiesLoadingState />}
      {showEmptyState && <RecentActivitiesEmptyState />}
      {showActivities && (
        <VStack space="2xl">
          {activities?.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default RecentActivities;
