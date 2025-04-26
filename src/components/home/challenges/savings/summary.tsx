import React from 'react';
import { Box, Heading, VStack } from '@/components/ui';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { useGetChallengeTotalSavings } from '@/hooks/checks';
import { ActivityIndicator } from 'react-native';

interface SavingsSummaryProps {
  challengeId: number;
}

export function SavingsSummary({ challengeId }: SavingsSummaryProps) {
  const { t } = useTranslation();
  const { data: totalSavings, isLoading } =
    useGetChallengeTotalSavings(challengeId);

  // Format currency with $ symbol and 2 decimal places
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Box className="bg-background rounded-lg p-4">
      <VStack space="md">
        <Heading size="lg" className="mb-1">
          {t('checks.savings.total')}
        </Heading>

        {isLoading ? (
          <Box className="flex items-center justify-center">
            <ActivityIndicator />
          </Box>
        ) : (
          <Text className="text-2xl font-bold text-green-600">
            {formatCurrency(totalSavings ?? 0)}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
