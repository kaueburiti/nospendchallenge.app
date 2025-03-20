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
    <Pressable onPress={handlePress} className="bg-card rounded-lg p-4">
      <HStack space="md">
        <Box className="flex-1">
          <Text className="font-medium">{activity.title}</Text>
          <Text className="text-muted-foreground text-sm">
            {activity.description}
          </Text>

          {activity.title && (
            <Text className="text-primary mt-1 text-xs">{activity.title}</Text>
          )}

          <Text className="text-muted-foreground mt-1 text-xs">{timeAgo}</Text>
        </Box>
      </HStack>
    </Pressable>
  );
};

export default ActivityItem;
