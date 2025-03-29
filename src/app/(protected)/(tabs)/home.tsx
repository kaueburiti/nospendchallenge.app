import React from 'react';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box, Heading, VStack } from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { i18n } from '@/i18n';
import { useSession } from '@/hooks/useSession';
import { Section } from '@/components/Section';
import { PlusCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui';
import RecentActivities from '@/components/home/recent-activities';
import ChallengeList from '@/components/home/challenges';
import PendingInvitations from '@/components/home/challenges/invite/pending-invitations';

const Explorepage = () => {
  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Section>
          <VStack space="4xl">
            <Greeting />
            <Box className="flex flex-1 flex-col overflow-auto">
              <Box className="mb-4 flex flex-row items-center justify-between">
                <Heading size="xl">{i18n.t('home.top_section_title')}</Heading>
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
  const { user } = useSession();
  const fullName = user?.user_metadata.display_name as string | undefined;

  if (!fullName) {
    return (
      <Box className="mt-8">
        <Heading size="3xl">Hello 👋</Heading>
      </Box>
    );
  }

  const firstName = fullName.split(' ')[0];

  return (
    <Box className="mt-8">
      <Heading size="xl">Hello,</Heading>
      <Heading size="3xl">{firstName} 👋</Heading>
    </Box>
  );
}
