import React from 'react';
import { Box, Heading, Text, VStack } from '@/components/ui';
import { useChallengesActivities } from '@/hooks/activities';
import ActivityItem from '@/components/home/recent-activities/item';
import { FlatList } from 'react-native';

interface ChallengeActivitiesTabProps {
  challengeId: string;
}

const ChallengeActivitiesTab = ({
  challengeId,
}: ChallengeActivitiesTabProps) => {
  const { data: activities, isLoading } = useChallengesActivities(
    [challengeId],
    50,
  );

  if (isLoading) {
    return (
      <Box className="p-4">
        <Text>Loading activities...</Text>
      </Box>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Box className="items-center justify-center p-4">
        <Heading size="md" className="mb-2">
          No activities yet
        </Heading>
        <Text className="text-muted-foreground text-center">
          Activities will appear here as participants join and complete
          challenge days.
        </Text>
      </Box>
    );
  }

  return (
    <FlatList
      data={activities}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <ActivityItem activity={item} />}
      ItemSeparatorComponent={() => <Box className="h-2" />}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

export default ChallengeActivitiesTab;
