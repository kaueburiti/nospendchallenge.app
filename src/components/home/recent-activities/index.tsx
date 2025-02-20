import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui';
import { Text } from '@/components/ui';
import React from 'react';
import { i18n } from '@/i18n';
import { useGetActivities } from '@/hooks/activities';
import { Activity } from '@/lib/db/repository/activity';
import { formatDistance, subDays } from 'date-fns';

const RecentActivities = () => {
  const { data: activities } = useGetActivities();

  return (
    <Box className="flex flex-1 flex-col pb-8">
      <Heading size="xl" className="mb-4">
        {i18n.t('home.bottom_section_title')}
      </Heading>

      <VStack space="2xl">
        {activities?.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </VStack>
    </Box>
  );
};

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <Box className="flex flex-row items-start justify-between gap-4">
      <Box className="flex flex-row items-center justify-between gap-4">
        <Box className="h-12 w-12 rounded-full bg-slate-300" />
        <Box className="flex flex-col">
          <Text className="text-lg font-semibold">{activity.title}</Text>
          <Text className="text-content-50">{activity.description}</Text>
        </Box>
      </Box>
      <Box>
        <Text className="text-content-50">
          {formatDistance(activity.created_at, new Date(), {
            addSuffix: true,
          })}
        </Text>
      </Box>
    </Box>
  );
}

export default RecentActivities;
