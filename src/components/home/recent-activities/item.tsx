import React from 'react';
import { Box, HStack, Text } from '@/components/ui';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ChallengeActivityWithRelations } from '@/hooks/activities';
import { useRouter } from 'expo-router';

interface ActivityItemProps {
  activity: ChallengeActivityWithRelations;
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
    <Box className="bg-card rounded-lg p-4" onPress={handlePress} pressable>
      <HStack space="md" alignItems="center">
        {activity.user_avatar_url ? (
          <Avatar
            size="md"
            source={{ uri: activity.user_avatar_url }}
            fallbackText={activity.user_display_name?.substring(0, 2) || '??'}
          />
        ) : (
          <Box className="bg-primary/20 flex h-10 w-10 items-center justify-center rounded-full">
            <Text className="text-primary font-medium">👤</Text>
          </Box>
        )}

        <Box className="flex-1">
          <Text className="font-medium">{activity.title}</Text>
          <Text className="text-muted-foreground text-sm">
            {activity.description}
          </Text>

          {activity.challenge_title && (
            <Text className="text-primary mt-1 text-xs">
              {activity.challenge_title}
            </Text>
          )}

          <Text className="text-muted-foreground mt-1 text-xs">{timeAgo}</Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default ActivityItem;
