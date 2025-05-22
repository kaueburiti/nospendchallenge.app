import React, { useContext } from 'react';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box, Heading, HStack, VStack } from '@/components/ui';
import { useSession } from '@/hooks/useSession';
import { Section } from '@/components/Section';
import { Redirect, router } from 'expo-router';
import ChallengeList from '@/components/home/challenges';
import { useTranslation } from '@/hooks/useTranslation';
import { TotalSavingsWidget } from '@/components/home/widgets/total-savings';
import { CurrentStrikeWidget } from '@/components/home/widgets/current-strike';
import { ProfileCard } from '@/components/profile/card';
import { RevenueCatContext } from '@/provider/RevenueCatProvider';
import { ListHeader } from '@/components/ui/list/header';
import PageSafeAreaView from '@/components/layout/page-safe-area-view';

const ExploreTopSection = () => {
  return (
    <VStack space="md">
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
  const { isProUser } = useContext(RevenueCatContext);

  if (!isProUser || true) {
    return <Redirect href="/(protected)/onboard" />;
  }

  return (
    <PageSafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Section>
          <VStack space="4xl">
            <HStack className="flex items-center justify-between">
              <Greeting />
              <ProfileCard user={session?.user ?? null} />
            </HStack>

            <ExploreTopSection />
            <Box className="flex flex-1 flex-col overflow-auto">
              <ListHeader
                title={t('home.top_section_title')}
                onPress={() => router.push('/(protected)/challenges/create')}
              />

              <ChallengeList limit={5} />
            </Box>
          </VStack>
        </Section>
      </ScrollView>
    </PageSafeAreaView>
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
