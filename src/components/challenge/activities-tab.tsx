import React from 'react';
import { Box, Heading, Text, VStack } from '@/components/ui';
import { useChallengesActivities } from '@/hooks/activities';
import ActivityItem from '@/components/home/recent-activities/item';
import { FlatList } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';

interface ChallengeActivitiesTabProps {
  challengeId: string;
}

const ChallengeActivitiesTab = ({
  challengeId,
}: ChallengeActivitiesTabProps) => {
  const { t } = useTranslation();
  const { data: activities, isLoading } = useChallengesActivities(
    [challengeId],
    50,
  );

  if (isLoading) {
    return (
      <Box className="p-4">
        <Text>{t('challenge.loading_activities')}</Text>
      </Box>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Box className="items-center justify-center p-4">
        <Heading size="md" className="mb-2">
          {t('empty.no_activities')}
        </Heading>
        <Text className="text-muted-foreground text-center">
          {t('challenge.activities_empty_description')}
        </Text>
      </Box>
    );
  }

  return (
    <Box className="p-4 pt-0">
      <Heading size="lg" className="mb-4">
        {t('challenge.activities_title')}
      </Heading>
      <FlatList
        data={activities}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <ActivityItem activity={item} />}
        ItemSeparatorComponent={() => <Box className="h-2" />}
        contentContainerStyle={{ padding: 16 }}
      />
    </Box>
  );
};

export default ChallengeActivitiesTab;
