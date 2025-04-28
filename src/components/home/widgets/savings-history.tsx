import React from 'react';
import { Box, Heading, VStack, Text } from '@/components/ui';
import { useGetAllChallengesSavingsHistory } from '@/hooks/checks';
import { LineChart } from 'react-native-chart-kit';
import { HomeWidgetWrapper } from './wrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { BadgeX, Frown } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

export const HomeWidgetSavingsHistory = () => {
  const { t } = useTranslation();

  return (
    <HomeWidgetWrapper>
      <VStack space="md">
        <Heading size="lg">{t('widgets.savings_history.title')}</Heading>
        <HomeWidgetSavingsHistoryChart />
      </VStack>
    </HomeWidgetWrapper>
  );
};

const HomeWidgetSavingsHistoryChart = () => {
  const { data, isLoading, error } = useGetAllChallengesSavingsHistory();
  const { t } = useTranslation();

  if (isLoading) {
    return <Skeleton className="h-24 w-full rounded-lg" />;
  }

  if (error) {
    return (
      <Box className="mx-auto flex max-w-48 items-center justify-center gap-2">
        <BadgeX className="h-10 w-10" color="#ff7979" />
        <Text className="text-center text-primary-500">
          Error loading chart data, please try again later.
        </Text>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box className="mx-auto flex max-w-48 items-center justify-center gap-2">
        <Frown className="h-10 w-10" color="#ff7979" />
        <Text className="text-center text-primary-500">
          {t('widgets.savings_history.empty')}
        </Text>
      </Box>
    );
  }

  const dataset: number[] = data
    .slice(-7)
    .map(item => Number(item.saved_amount ?? 0));

  return (
    <Box className="bg-red-100">
      <LineChart
        data={{
          labels: dataset.map((_, index) => `D${index + 1}`),
          datasets: [
            {
              data: dataset,
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
  );
};
