import React from 'react';
import { Box, Heading, VStack } from '@/components/ui';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { ActivityIndicator } from 'react-native';
import { useGetChallenges } from '@/hooks/challenges';
import { useQuery } from '@tanstack/react-query';
import { getChallengeTotalSavings } from '@/lib/db/repository/check';

export default function TotalSavingsSummary() {
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
    <Box className="bg-background rounded-lg">
      <VStack space="md">
        <Heading size="lg">{t('home.total_savings')}</Heading>

        {isLoading ? (
          <Box className="flex items-center justify-center">
            <ActivityIndicator />
          </Box>
        ) : (
          <Text className="text-4xl font-bold text-success-500">
            {formatCurrency(totalSavings)}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
