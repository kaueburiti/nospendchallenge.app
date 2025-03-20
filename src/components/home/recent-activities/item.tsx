import React from 'react';
import { Box, HStack, Pressable, Text } from '@/components/ui';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'expo-router';
import { type Tables } from '@/lib/db/database.types';

interface ActivityItemProps {
  activity: Tables<'challenge_activities'>;
}

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const router = useRouter();
  const timeAgo = formatDistanceToNow(new Date(activity.created_at), {
    addSuffix: true,
  });

  const handlePress = () => {
    if (activity.challenge_id) {
      router.push(`/challenge/${activity.challenge_id}`);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-card rounded-lg border border-gray-200 bg-gray-100 p-4">
      <HStack space="md">
        <Box className="flex-1 gap-1">
          <Box className="flex flex-row items-center justify-between">
            <Text className="text-sm font-bold">{activity.title} 🎉</Text>
            <Text className="text-muted-foreground text-sm">{timeAgo}</Text>
          </Box>
          <Text className="text-muted-foreground text-xs">
            {activity.description}
          </Text>
        </Box>
      </HStack>
    </Pressable>
  );
};

export default ActivityItem;
