import React from 'react';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box, Heading, VStack } from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { useSession } from '@/hooks/useSession';
import { Section } from '@/components/Section';
import { PlusCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui';
import RecentActivities from '@/components/home/recent-activities';
import ChallengeList from '@/components/home/challenges';
import PendingInvitations from '@/components/home/challenges/invite/pending-invitations';
import { useTranslation } from '@/hooks/useTranslation';

const Explorepage = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Section>
          <VStack space="4xl">
            <Greeting />
            <Box className="flex flex-1 flex-col overflow-auto">
              <Box className="mb-4 flex flex-row items-center justify-between">
                <Heading size="xl">{t('home.top_section_title')}</Heading>
                <Button
                  onPress={() => router.push('/(protected)/create-challenge')}>
                  <PlusCircle size={24} color="white" />
                </Button>
              </Box>
              <PendingInvitations />
              <ChallengeList limit={3} />
            </Box>
            <RecentActivities />
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
      <Box className="mt-8">
        <Heading size="3xl">{greeting} 👋</Heading>
      </Box>
    );
  }

  const firstName = fullName.split(' ')[0];

  return (
    <Box className="mt-8">
      <Heading size="xl">{greeting},</Heading>
      <Heading size="3xl">{firstName} 👋</Heading>
    </Box>
  );
}
