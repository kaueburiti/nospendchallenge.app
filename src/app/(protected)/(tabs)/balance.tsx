import React from 'react';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box, VStack, HStack, Text, Divider, Heading } from '@/components/ui';
import { Section } from '@/components/Section';
import { useTranslation } from '@/hooks/useTranslation';
import { ListHeader } from '@/components/ui/list/header';
import { useBalance } from '@/hooks/balance/useBalance';
import { ActivityIndicator } from 'react-native';
import { formatCurrency } from '@/lib/utils';
import PageSafeAreaView from '@/components/layout/page-safe-area-view';
import classNames from 'classnames';

const BalanceSummaryCard = ({
  totalSaved,
  totalSpent,
  netBalance,
}: {
  totalSaved: number;
  totalSpent: number;
  netBalance: number;
}) => {
  return (
    <Box className="flex-row">
      <VStack className="flex-1 items-center border-r border-outline-300 py-2">
        <Heading size="xl" className="text-success-500">
          {formatCurrency(totalSaved)}
        </Heading>
        <Text size="xs">Total Saved</Text>
      </VStack>
      <Divider
        orientation="horizontal"
        className="flex w-1 self-center bg-background-300"
      />
      <VStack className="flex-1 items-center border-r border-outline-300 py-2">
        <Heading size="xl" className="text-error-500">
          {formatCurrency(totalSpent)}
        </Heading>
        <Text size="xs">Total Spent</Text>
      </VStack>
      <Divider
        orientation="horizontal"
        className="flex w-1 self-center bg-background-300 sm:hidden"
      />
      <VStack className="flex-1 items-center pt-2">
        <Heading
          size="xl"
          className={netBalance >= 0 ? 'text-success-500' : 'text-error-500'}>
          {formatCurrency(netBalance)}
        </Heading>
        <Text size="xs">Overall Balance</Text>
      </VStack>
    </Box>
  );
};

const ChallengeBalanceCard = ({
  title,
  totalSaved,
  totalSpent,
  netBalance,
}: {
  title: string;
  totalSaved: number;
  totalSpent: number;
  netBalance: number;
}) => {
  return (
    <Box className="rounded-lg border border-gray-200 bg-white p-3 dark:bg-gray-800">
      <VStack space="sm">
        <Heading size="lg">{title}</Heading>

        <Box className="flex-row">
          <VStack className="flex-1 items-center border-r border-outline-300 py-2">
            <Heading size="md" className="text-success-500">
              {formatCurrency(totalSaved)}
            </Heading>
            <Text size="xs">Saved</Text>
          </VStack>
          <Divider
            orientation="horizontal"
            className="flex w-1 self-center bg-background-300"
          />
          <VStack className="flex-1 items-center border-r border-outline-300 py-2">
            <Heading size="md" className="text-error-500">
              {formatCurrency(totalSpent)}
            </Heading>
            <Text size="xs">Spent</Text>
          </VStack>
          <Divider
            orientation="horizontal"
            className="flex w-1 self-center bg-background-300 sm:hidden"
          />
          <VStack className="flex-1 items-center pt-2">
            <Heading
              size="md"
              className={
                netBalance >= 0 ? 'text-success-500' : 'text-error-500'
              }>
              {formatCurrency(netBalance)}
            </Heading>
            <Text size="xs">Balance</Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

const HistoryItem = ({
  date,
  savedAmount,
  spentAmount,
  message,
  challengeName,
}: {
  date: string;
  savedAmount: number;
  spentAmount: number;
  status: string;
  message: string;
  challengeName: string;
}) => {
  const amount = savedAmount || spentAmount;
  const isSaved = savedAmount > spentAmount;

  return (
    <Box className="rounded-lg border border-gray-200 bg-white p-3 dark:bg-gray-800">
      <VStack space="sm">
        <HStack className="items-center justify-between">
          <VStack space="xs">
            <Text className="text-xs">
              {new Date(date).toLocaleDateString()}
            </Text>
            <Heading size="md">{challengeName}</Heading>
            {message && <Text className="text-md">{message}</Text>}
          </VStack>

          <Box>
            <Text
              className={classNames('text-2xl font-bold', {
                'text-emerald-600': isSaved,
                'text-red-600': !isSaved,
              })}>
              {isSaved ? '+ ' : '- '}
              {formatCurrency(amount)}
            </Text>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

export default function BalanceScreen() {
  const { t } = useTranslation();
  const { data, isLoading } = useBalance();

  if (isLoading) {
    return (
      <PageSafeAreaView>
        <Box className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </Box>
      </PageSafeAreaView>
    );
  }

  if (!data) {
    return (
      <PageSafeAreaView>
        <ScrollView className="h-[1px] flex-1">
          <Section>
            <VStack space="4xl">
              <ListHeader
                title={t('balance.title')}
                titleSize="3xl"
                description={t('balance.description')}
              />
              <Box className="flex-1 items-center justify-center p-4">
                <Text className="text-center text-gray-500 dark:text-gray-400">
                  {t('balance.challenges.empty_description')}
                </Text>
              </Box>
            </VStack>
          </Section>
        </ScrollView>
      </PageSafeAreaView>
    );
  }

  return (
    <PageSafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Section>
          <ListHeader
            title={t('balance.title')}
            titleSize="3xl"
            description={t('balance.description')}
          />

          <VStack space="4xl">
            {/* Summary Card */}
            <VStack space="md">
              <Text className="text-lg font-semibold text-gray-900">
                {t('balance.summary.title')}
              </Text>
              <BalanceSummaryCard
                totalSaved={data.totalSaved}
                totalSpent={data.totalSpent}
                netBalance={data.netBalance}
              />
            </VStack>

            {/* Challenges Section */}
            <VStack space="md">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('balance.challenges.title')}
              </Text>
              {data.challenges.length > 0 ? (
                <VStack space="sm">
                  {data.challenges.map(challenge => (
                    <ChallengeBalanceCard
                      key={challenge.id}
                      title={challenge.title}
                      totalSaved={challenge.totalSaved}
                      totalSpent={challenge.totalSpent}
                      netBalance={challenge.netBalance}
                    />
                  ))}
                </VStack>
              ) : (
                <Box className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <Text className="text-center text-gray-500 dark:text-gray-400">
                    {t('balance.challenges.empty_description')}
                  </Text>
                </Box>
              )}
            </VStack>

            {/* History Section */}
            <VStack space="md">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('balance.history.title')}
              </Text>
              {data.history.length > 0 ? (
                <VStack space="sm">
                  {data.history.map((item, index) => (
                    <HistoryItem
                      key={`${item.date}-${index}`}
                      date={item.date}
                      savedAmount={item.savedAmount ?? 0}
                      spentAmount={item.spentAmount}
                      status={item.status}
                      message={item.message ?? ''}
                      challengeName={
                        data.challenges.find(
                          challenge => challenge.id === item.challengeId,
                        )?.title
                      }
                    />
                  ))}
                </VStack>
              ) : (
                <Box className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <Text className="text-center text-gray-500 dark:text-gray-400">
                    {t('balance.history.empty_description')}
                  </Text>
                </Box>
              )}
            </VStack>
          </VStack>
        </Section>
      </ScrollView>
    </PageSafeAreaView>
  );
}
