import React from 'react';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box, Heading, HStack, VStack, Text } from '@/components/ui';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { useSession } from '@/hooks/useSession';
import { Section } from '@/components/Section';
import { Badge, PlusCircle, Trophy } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui';
import RecentActivities from '@/components/home/recent-activities';
import ChallengeList from '@/components/home/challenges';
import PendingInvitations from '@/components/home/challenges/invite/pending-invitations';
import { useTranslation } from '@/hooks/useTranslation';
import TotalSavingsSummary from '@/components/home/savings-summary';
import { useGetAllChallengesSavingsHistory } from '@/hooks/checks';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

const GraphTopSection = ({ title }: { title: string }) => {
  const { data, isLoading, error } = useGetAllChallengesSavingsHistory();

  return (
    <Box className="bg-background overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
      <VStack space="md">
        <Heading size="lg">{title}</Heading>
        {error ? (
          <Text>Error loading chart data</Text>
        ) : data && data.length > 0 ? (
          <Box className="bg-red-100">
            <LineChart
              data={{
                datasets: [
                  {
                    data: data.slice(-7).map(item => item.saved_amount || 0),
                  },
                ],
              }}
              width={400}
              height={100}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 121, 121, ${opacity})`,
                style: {
                  borderRadius: 0,
                },
                propsForLabels: {
                  fontSize: 11, // Decreased font size for labels
                },
                propsForBackgroundLines: {
                  strokeWidth: 0,
                },
                formatYLabel: value => `$ ${value}`,
              }}
              bezier
              style={{
                borderRadius: 0,
                padding: 0,
                margin: 0,
                marginLeft: -30, // Negative margin to reduce left padding
              }}
            />
          </Box>
        ) : (
          <Text>No data available</Text>
        )}
      </VStack>
    </Box>
  );
};
const ExploreTopSection = () => {
  return (
    <VStack space="md">
      <GraphTopSection title="Savings History" />
      <HStack space="md">
        <Box className="flex-1 rounded-lg border border-gray-200 bg-white p-4">
          <Box className="flex flex-row items-center gap-4">
            <Box className="rounded-full bg-primary-100 p-2">
              <Trophy size={24} color="white" />
            </Box>
            <Box>
              <Text className="text-sm">Current Strike</Text>
              <Text className="text-2xl font-bold">5 Days</Text>
            </Box>
          </Box>
        </Box>
        <Box className="flex-1 rounded-lg border border-gray-200 bg-white p-4">
          <Box className="flex flex-row items-center gap-4">
            <Box className="rounded-full bg-primary-100 p-2">
              <Trophy size={24} color="white" />
            </Box>
            <Box>
              <Text className="text-sm">Total Savings</Text>
              <Text className="text-2xl font-bold">$100</Text>
            </Box>
          </Box>
        </Box>
      </HStack>
    </VStack>
  );
};

const Explorepage = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Section>
          <VStack space="4xl">
            <Greeting />

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
