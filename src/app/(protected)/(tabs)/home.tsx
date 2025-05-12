import React from 'react';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box, Heading, HStack, VStack, Text } from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { useSession } from '@/hooks/useSession';
import { Section } from '@/components/Section';
import { PlusCircle, Trophy } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui';
import RecentActivities from '@/components/home/recent-activities';
import ChallengeList from '@/components/home/challenges';
import PendingInvitations from '@/components/home/challenges/invite/pending-invitations';
import { useTranslation } from '@/hooks/useTranslation';
import { HomeWidgetSavingsHistory } from '@/components/home/widgets/savings-history';
import { TotalSavingsWidget } from '@/components/home/widgets/total-savings';
import { CurrentStrikeWidget } from '@/components/home/widgets/current-strike';
import { ProfileCard } from '@/components/profile/card';

const ExploreTopSection = () => {
  return (
    <VStack space="md">
      <HomeWidgetSavingsHistory />
      <HStack space="md">
        <CurrentStrikeWidget />
        <TotalSavingsWidget />
      </HStack>
    </VStack>
  );
};

const Explorepage = () => {
  const { t } = useTranslation();
  const { session } = useSession();

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Section className="pt-4">
          <VStack space="4xl">
            <HStack className="flex items-center justify-between">
              <Greeting />
              <ProfileCard user={session?.user ?? null} />
            </HStack>

            <ExploreTopSection />
            <Box className="flex flex-1 flex-col overflow-auto">
              <Box className="mb-4 flex flex-row items-center justify-between">
                <Heading size="xl">{t('home.top_section_title')}</Heading>
                <Button
                  onPress={() => router.push('/(protected)/create-challenge')}>
                  <PlusCircle size={24} color="white" />
                </Button>
              </Box>
              <PendingInvitations />
              <ChallengeList limit={5} />
            </Box>
          </VStack>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explorepage;

function Greeting() {
  const { t } = useTranslation();
  const { session } = useSession();
  const greeting = t('home.greeting');
  const fullName = session?.user?.user_metadata?.first_name as
    | string
    | undefined;

  if (!fullName) {
    return (
      <Box>
        <Heading size="3xl">{greeting} 👋</Heading>
      </Box>
    );
  }

  const firstName = fullName.split(' ')[0];

  return (
    <Box>
      <Heading size="xl">{greeting},</Heading>
      <Heading size="3xl">{firstName} 👋</Heading>
    </Box>
  );
}
