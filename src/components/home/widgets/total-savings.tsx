import React from 'react';
import { DollarSign } from 'lucide-react-native';
import { HomeWidgetWrapper } from './wrapper';

import { Box, Heading, HStack, VStack } from '@/components/ui';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { ActivityIndicator } from 'react-native';
import { useGetChallenges } from '@/hooks/challenges';
import { useQuery } from '@tanstack/react-query';
import { getChallengeTotalSavings } from '@/lib/db/repository/check';

export function TotalSavingsWidget() {
  const { t } = useTranslation();
  const { data: challenges, isLoading: isLoadingChallenges } =
    useGetChallenges();

  // Get total savings for each challenge
  const challengeIds = challenges?.map(challenge => challenge.id) ?? [];

  // Get all savings using a custom query that aggregates the data
  const { data: savingsData, isLoading: isLoadingSavings } = useQuery({
    queryKey: ['total-savings', challengeIds],
    queryFn: async () => {
      if (challengeIds.length === 0) return 0;

      // Fetch savings for each challenge and sum them up
      const savingsPromises = challengeIds.map(id =>
        getChallengeTotalSavings(id),
      );
      const allSavings = await Promise.all(savingsPromises);

      // Sum up all the savings
      return allSavings.reduce((total, amount) => total + (amount ?? 0), 0);
    },
    enabled: challengeIds.length > 0,
  });

  // Format currency with $ symbol and 2 decimal places
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isLoading = isLoadingChallenges || isLoadingSavings;
  const totalSavings = savingsData ?? 0;

  return (
    <HomeWidgetWrapper>
      <HStack space="md" className="items-center">
        <Box className="rounded-full bg-primary-100 p-2">
          <DollarSign size={24} color="white" />
        </Box>

        <VStack space="xs">
          <Heading size="sm" className="mb-0 font-normal">
            {t('home.total_savings')}
          </Heading>

          {isLoading ? (
            <Box className="flex items-center justify-center">
              <ActivityIndicator />
            </Box>
          ) : (
            <Text className="text-2xl font-bold text-success-500">
              {formatCurrency(totalSavings)}
            </Text>
          )}
        </VStack>
      </HStack>
    </HomeWidgetWrapper>
  );
}
