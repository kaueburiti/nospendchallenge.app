import React from 'react';
import { Box, Button, Heading, Text, VStack } from '@/components/ui';
import { ScrollView } from '@/components/ui/scroll-view';
import DaysGrid from '@/components/home/challenges/days-grid';
import ChallengeScores from '@/components/home/challenges/scores';
import { type Tables } from '@/lib/db/database.types';
import { useTranslation } from '@/hooks/useTranslation';
import { ProgressChart } from 'react-native-chart-kit';
import { useChallengeStatistics } from '@/hooks/challenges/useChallengeStatistics';
import { intervalToDuration } from 'date-fns';

interface ChallengeDetailsTabProps {
  challenge: Tables<'challenges'>;
  challengeId: string;
  isOwner: boolean;
  onCheckIn: () => void;
}

const ChallengeDetailsTab = ({
  challenge,
  onCheckIn,
}: ChallengeDetailsTabProps) => {
  const { t } = useTranslation();
  const { daysProgress, savingsProgress, successRate } = useChallengeStatistics(
    challenge.id,
  );

  const totalDays = intervalToDuration({
    start: new Date(challenge.start_date),
    end: new Date(challenge.end_date),
  }).days;
  const daysPassed = intervalToDuration({
    start: new Date(challenge.start_date),
    end: new Date(),
  }).days;

  return (
    <ScrollView>
      <VStack space="lg" className="p-4 pt-0">
        <Box className="flex flex-row items-center gap-2">
          <Box>
            <ProgressChart
              data={{
                data: [successRate, savingsProgress, daysProgress],
              }}
              width={200}
              height={200}
              strokeWidth={16}
              radius={32}
              chartConfig={{
                backgroundColor: '#fbfbfb',
                backgroundGradientFrom: '#fbfbfb',
                backgroundGradientTo: '#fbfbfb',
                decimalPlaces: 2,
                color: (opacity = 1, index) => {
                  if (index === 0) {
                    return `rgba(116, 180, 253, ${opacity})`;
                  } else if (index === 1) {
                    return `rgba(129, 226, 161, ${opacity})`;
                  } else if (index === 2) {
                    return `rgba(255, 121, 121, ${opacity})`;
                  }
                  return `rgba(255, 121, 121, ${opacity})`;
                },
                style: {
                  borderRadius: 16,
                  padding: 0,
                },
              }}
              hideLegend={true}
            />
          </Box>
          <VStack space="xl">
            <Box>
              <Heading size="xs">Challenge Progress</Heading>
              <Text className="text-primary text-4xl font-bold text-primary-500">
                {daysPassed}/{totalDays} Days
              </Text>
            </Box>
            <Box>
              <Heading size="xs">Savings Progress</Heading>
              <Text className="text-primary text-4xl font-bold text-success-500">
                ${savingsProgress * (challenge.savings_goal ?? 0)}
                /${challenge.savings_goal ?? 0}
              </Text>
            </Box>
            <Box>
              <Heading size="xs">Positive Checks</Heading>
              <Text className="text-primary text-4xl font-bold text-info-500">
                {Math.round(successRate * 100)}%
              </Text>
            </Box>
          </VStack>
        </Box>

        <ChallengeScores />

        <Box>
          <Button onPress={onCheckIn} size="lg">
            <Text className="text-white">Create a check In</Text>
          </Button>
        </Box>

        <Box>
          <Heading size="xl" className="mb-4">
            {t('checks.my_checks')}
          </Heading>
          <DaysGrid />
        </Box>
      </VStack>
    </ScrollView>
  );
};

export default ChallengeDetailsTab;
