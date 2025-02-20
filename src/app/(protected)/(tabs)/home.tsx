import React from 'react';
import { ScrollView } from 'react-native';
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

const Explorepage = () => {
  const { user } = useSession();

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Section>
          <VStack space="4xl">
            <Box className="mt-8">
              <Heading size="xl">Hello,</Heading>
              <Heading size="3xl">{user?.user_metadata.full_name} 👋</Heading>
            </Box>
            <Box className="flex flex-1 flex-col overflow-auto">
              <Box className="mb-6 flex flex-row items-center justify-between">
                <Heading size="xl">{i18n.t('home.top_section_title')}</Heading>
                <Button
                  onPress={() => router.push('/(protected)/create-challenge')}>
                  <PlusCircle size={24} color="white" />
                </Button>
              </Box>
              <ChallengeList />
            </Box>
            <Box className="">
              <Box className="bg-linear-to-r h-40 w-full rounded-lg bg-slate-200" />
            </Box>
            <RecentActivities />
          </VStack>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explorepage;
