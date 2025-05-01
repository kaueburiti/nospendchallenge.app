import React from 'react';
import { Box, Heading, Text } from '@/components/ui';
import { useChallengesActivities } from '@/hooks/activities';
import ActivityItem from '@/components/home/recent-activities/item';
import { FlatList } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
interface ChallengeActivitiesTabProps {
  challengeId: string;
}

const ChallengeActivities = ({ challengeId }: ChallengeActivitiesTabProps) => {
  const { t } = useTranslation();
  const { data: activities, isLoading } = useChallengesActivities(
    [challengeId],
    50,
  );

  if (isLoading) {
    return (
      <Box className="p-4">
        <Text>{t('activities.loading')}</Text>
      </Box>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Box className="items-center justify-center p-4">
        <Heading size="md" className="mb-2">
          {t('activities.no_activities')}
        </Heading>
        <Text className="text-muted-foreground text-center">
          {t('activities.no_activities_description')}
        </Text>
      </Box>
    );
  }

  return (
    <Box className="pt-0">
      <Heading size="lg" className="mb-4">
        {t('activities.title')}
      </Heading>
      <FlatList
        className="mb-12"
        data={activities}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <ActivityItem activity={item} />}
        ItemSeparatorComponent={() => <Box className="h-2" />}
      />
    </Box>
  );
};

export default ChallengeActivities;
