import React, { useContext } from 'react';
import { Asterisk, DollarSign } from 'lucide-react-native';
import { HomeWidgetWrapper } from './wrapper';

import { Box, Heading, HStack, VStack } from '@/components/ui';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { ActivityIndicator } from 'react-native';
import { useGetChallenges } from '@/hooks/challenges';
import { useQuery } from '@tanstack/react-query';
import { getChallengeTotalSavings } from '@/lib/db/repository/check';
import { RevenueCatContext } from '@/provider/RevenueCatProvider';

export function TotalSavingsWidget() {
  const { t } = useTranslation();
  const { isProUser } = useContext(RevenueCatContext);
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
    <HomeWidgetWrapper isPro={true}>
      <HStack space="md" className="items-center">
        <Box className="rounded-full bg-primary-500 p-2">
          <DollarSign size={24} color="white" />
        </Box>

        <VStack space="xs">
          <Heading size="xs" className="mb-0 font-normal">
            {t('widgets.total_savings.title')}
          </Heading>

          {isLoading ? (
            <Box className="flex items-center justify-center">
              <ActivityIndicator />
            </Box>
          ) : (
            <Text className="text-2xl font-bold text-success-500">
              {isProUser ? (
                formatCurrency(totalSavings)
              ) : (
                <VStack>
                  <HStack>
                    <Asterisk size={24} color="#1ABC9C" />
                    <Asterisk size={24} color="#1ABC9C" />
                    <Asterisk size={24} color="#1ABC9C" />
                    <Asterisk size={24} color="#1ABC9C" />
                  </HStack>
                </VStack>
              )}
            </Text>
          )}
        </VStack>
      </HStack>
    </HomeWidgetWrapper>
  );
}
