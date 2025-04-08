import React from 'react';
import { Box, Button, Heading, Text, VStack } from '@/components/ui';
import { ScrollView } from '@/components/ui/scroll-view';
import DaysGrid from '@/components/home/challenges/days-grid';
import ChallengeScores from '@/components/home/challenges/scores';
import ChallengeProgressBar from '@/components/home/challenges/progress';
import { type Tables } from '@/lib/db/database.types';
import { useTranslation } from '@/hooks/useTranslation';
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

  return (
    <ScrollView>
      <VStack space="lg" className="p-4 pt-0">
        <Box>
          <Heading size="lg" className="mb-1">
            {t('challenge.challenge_progress')}
          </Heading>
          <ChallengeProgressBar challenge={challenge} showDates />
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
