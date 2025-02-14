import React from 'react';
import Banner from '../../../components/Banner';
import { ScrollView } from 'react-native';
import { Box, Button, Heading } from '@/components/ui';
import { Text } from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import * as WebBrowser from 'expo-web-browser';
import { Link, LinkText } from '@/components/ui';
import BottomSection from '../../../components/home/BottomSection';
import TopSection from '../../../components/home/TopSection';
import config from '../../../../config';
import { useProducts } from '@/hooks/product';
import { i18n } from '@/i18n';
import { router } from 'expo-router';
import { useGetChallenges } from '@/hooks/challenges';

const Explorepage = () => {
  const { data: products } = useProducts();
  const { data: challenges } = useGetChallenges();

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Box className={'flex flex-col gap-8'}>
          <TopSection
            items={challenges ?? []}
            sectionTitle={i18n.t('home.top_section_title')}
          />
          <Box className="px-4 md:px-0">
            <Box className="bg-linear-to-r h-40 w-full rounded-lg bg-slate-200" />
          </Box>
          <Box className="flex flex-1 flex-col px-4 pb-8 md:px-0">
            <Heading size="xl" className="mb-4">
              {i18n.t('home.bottom_section_title')}
            </Heading>

            <Box className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <RecentActivity key={index} />
              ))}
            </Box>
          </Box>
        </Box>
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
