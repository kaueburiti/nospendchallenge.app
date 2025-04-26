import React from 'react';
import { Box, VStack } from '@/components/ui';
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
    <Box className="bg-background rounded-lg p-4 shadow-sm">
      <VStack space="md">
        <Text className="text-md text-foreground font-semibold">
          {t('checks.savings.total')}
        </Text>

        {isLoading ? (
          <Box className="flex items-center justify-center">
            <ActivityIndicator />
          </Box>
        ) : (
          <Text className="text-3xl font-bold text-green-600">
            {formatCurrency(totalSavings ?? 0)}
          </Text>
        )}
      </VStack>
    </Box>
  );
}
