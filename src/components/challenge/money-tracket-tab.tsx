import React from 'react';
import { Box, VStack, HStack, Text, Heading } from '@/components/ui';
import { ScrollView } from '@/components/ui/scroll-view';
import { useGetUserChecksByChallenge } from '@/hooks/checks';
import { useTranslation } from '@/hooks/useTranslation';
import { format } from 'date-fns';
import { CheckItemDisplay } from '@/components/home/challenges/check/item-display';
import { CheckCircle, XCircle } from 'lucide-react-native';

interface MoneyTrackerTabProps {
  challengeId: string;
}

export default function MoneyTrackerTab({ challengeId }: MoneyTrackerTabProps) {
  const { t } = useTranslation();
  const { data: checks, isLoading } = useGetUserChecksByChallenge(
    Number(challengeId),
  );

  if (isLoading || !checks) {
    return null;
  }

  console.log(checks.length);

  // Sort checks by date in descending order (most recent first)
  const sortedChecks = [...checks].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <ScrollView>
      <VStack space="lg" className="p-4">
        <Heading size="xl">
          {t('checks.money_tracker.title') || 'Money Tracker'}
        </Heading>

        {sortedChecks.map(check => (
          <Box
            key={check.id}
            className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <HStack space="md" className="items-start">
              <Box className="mt-1">
                {check.status === 'success' ? (
                  <CheckCircle className="h-6 w-6 text-success-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-error-500" />
                )}
              </Box>

              <VStack space="sm" className="flex-1">
                <HStack className="justify-between">
                  <Text className="font-semibold">
                    {format(new Date(check.date), 'MMM d, yyyy')}
                  </Text>
                  {check.status === 'success' && check.saved_amount && (
                    <Text className="font-semibold text-success-500">
                      +${check.saved_amount.toFixed(2)}
                    </Text>
                  )}
                  {check.status === 'failure' && check.spent_amount > 0 && (
                    <Text className="font-semibold text-error-500">
                      -${check.spent_amount.toFixed(2)}
                    </Text>
                  )}
                </HStack>

                {check.message && (
                  <Text className="text-sm text-gray-600 dark:text-gray-300">
                    {check.message}
                  </Text>
                )}

                {check.status === 'failure' && (
                  <CheckItemDisplay checkId={check.id} />
                )}
              </VStack>
            </HStack>
          </Box>
        ))}

        {sortedChecks.length === 0 && (
          <Box className="items-center justify-center py-8">
            <Text className="text-center text-gray-500">
              {t('checks.money_tracker.empty') || 'No checks recorded yet'}
            </Text>
          </Box>
        )}
      </VStack>
    </ScrollView>
  );
}
