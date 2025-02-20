import { Box } from '@/components/ui';
import { Text } from '@/components/ui';
import React from 'react';
import { Activity } from '@/lib/db/repository/activity';
import { formatDistance } from 'date-fns';

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

export default ActivityItem;
