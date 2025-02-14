import React from 'react';
import { ScrollView } from 'react-native';
import { Box, Heading } from '@/components/ui';
import { Text } from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import TopSection from '../../../components/home/TopSection';
import { i18n } from '@/i18n';
import { useGetChallenges } from '@/hooks/challenges';
import { useSession } from '@/hooks/useSession';
import { Section } from '@/components/Section';

const Explorepage = () => {
  const { data: challenges } = useGetChallenges();
  const { user } = useSession();

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Section className={'flex flex-col gap-8'}>
          <Box className="mt-8">
            <Heading size="xl">Hello,</Heading>
            <Heading size="3xl">{user?.user_metadata.full_name} 👋</Heading>
          </Box>
          <TopSection
            items={challenges ?? []}
            sectionTitle={i18n.t('home.top_section_title')}
          />
          <Box className="">
            <Box className="bg-linear-to-r h-40 w-full rounded-lg bg-slate-200" />
          </Box>
          <Box className="flex flex-1 flex-col pb-8">
            <Heading size="xl" className="mb-4">
              {i18n.t('home.bottom_section_title')}
            </Heading>

            <Box className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <RecentActivity key={index} />
              ))}
            </Box>
          </Box>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

function RecentActivity() {
  return (
    <Box className="flex flex-row items-start justify-between gap-4">
      <Box className="flex flex-row items-start justify-between gap-4">
        <Box className="h-16 w-16 rounded-full bg-slate-300" />
        <Box className="flex flex-col gap-1">
          <Text className="text-lg font-semibold">You&apos;re rocking 🚀</Text>
          <Text className="text-content-50">Congratulations!</Text>
        </Box>
      </Box>
      <Box>
        <Text className="text-content-50">2 days ago</Text>
      </Box>
    </Box>
  );
}
export default Explorepage;
