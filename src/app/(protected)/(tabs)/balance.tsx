import React from 'react';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box, VStack, HStack, Text, Divider } from '@/components/ui';
import { Section } from '@/components/Section';
import { useTranslation } from '@/hooks/useTranslation';
import { ListHeader } from '@/components/ui/list/header';
import { useBalance } from '@/hooks/balance/useBalance';
import { ActivityIndicator } from 'react-native';
import { ArrowDown, ArrowUp, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency } from '@/lib/utils';
import PageSafeAreaView from '@/components/layout/page-safe-area-view';
const BalanceSummaryCard = ({
  totalSaved,
  totalSpent,
  netBalance,
}: {
  totalSaved: number;
  totalSpent: number;
  netBalance: number;
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <Box className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <VStack space="md">
        <HStack className="items-center justify-between">
          <Text className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            {t('balance.total_saved')}
          </Text>
          <HStack className="items-center space-x-1">
            <ArrowDown size={16} color={isDark ? '#10B981' : '#059669'} />
            <Text className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalSaved)}
            </Text>
          </HStack>
        </HStack>

        <HStack className="items-center justify-between">
          <Text className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            {t('balance.total_spent')}
          </Text>
          <HStack className="items-center space-x-1">
            <ArrowUp size={16} color={isDark ? '#EF4444' : '#DC2626'} />
            <Text className="text-lg font-semibold text-red-600 dark:text-red-400">
              {formatCurrency(totalSpent)}
            </Text>
          </HStack>
        </HStack>

        <Divider />

        <HStack className="items-center justify-between">
          <Text className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            {t('balance.net_balance')}
          </Text>
          <HStack className="items-center space-x-1">
            <TrendingUp
              size={16}
              color={
                netBalance >= 0
                  ? isDark
                    ? '#10B981'
                    : '#059669'
                  : isDark
                    ? '#EF4444'
                    : '#DC2626'
              }
            />
            <Text
              className={`text-lg font-semibold ${
                netBalance >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
              {formatCurrency(netBalance)}
            </Text>
          </HStack>
        </HStack>
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
  const { isDark } = useTheme();

  return (
    <Box className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
      <VStack space="sm">
        <Text className="font-semibold text-gray-900 dark:text-white">
          {title}
        </Text>
        <HStack className="justify-between">
          <VStack>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              Saved
            </Text>
            <Text className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalSaved)}
            </Text>
          </VStack>
          <VStack>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              Spent
            </Text>
            <Text className="text-sm font-medium text-red-600 dark:text-red-400">
              {formatCurrency(totalSpent)}
            </Text>
          </VStack>
          <VStack>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              Balance
            </Text>
            <Text
              className={`text-sm font-medium ${
                netBalance >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
              {formatCurrency(netBalance)}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

const HistoryItem = ({
  date,
  savedAmount,
  spentAmount,
  status,
}: {
  date: string;
  savedAmount: number | null;
  spentAmount: number;
  status: string;
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  return (
    <Box className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
      <VStack space="sm">
        <HStack className="justify-between">
          <Text className="font-medium text-gray-900 dark:text-white">
            {new Date(date).toLocaleDateString()}
          </Text>
          <Box
            className={`rounded-full px-2 py-1 ${
              status === 'success'
                ? 'bg-emerald-100 dark:bg-emerald-900'
                : 'bg-red-100 dark:bg-red-900'
            }`}>
            <Text
              className={`text-xs font-medium ${
                status === 'success'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
              {t(`balance.history.status.${status}`)}
            </Text>
          </Box>
        </HStack>
        <HStack className="justify-between">
          <VStack>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {t('balance.history.saved')}
            </Text>
            <Text className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {formatCurrency(savedAmount ?? 0)}
            </Text>
          </VStack>
          <VStack>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {t('balance.history.spent')}
            </Text>
            <Text className="text-sm font-medium text-red-600 dark:text-red-400">
              {formatCurrency(spentAmount)}
            </Text>
          </VStack>
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
          <VStack space="4xl">
            <ListHeader
              title={t('balance.title')}
              titleSize="3xl"
              description={t('balance.description')}
            />

            {/* Summary Card */}
            <BalanceSummaryCard
              totalSaved={data.totalSaved}
              totalSpent={data.totalSpent}
              netBalance={data.netBalance}
            />

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
                      savedAmount={item.savedAmount}
                      spentAmount={item.spentAmount}
                      status={item.status}
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
