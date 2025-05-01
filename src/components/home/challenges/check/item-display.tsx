import React from 'react';
import { Box, VStack, HStack } from '@/components/ui';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { useCheckItems } from '@/hooks/checks';

interface ItemDisplayProps {
  checkId: number;
}

export const CheckItemDisplay = ({ checkId }: ItemDisplayProps) => {
  console.log('checkId', checkId);
  const { t } = useTranslation();
  const { data: items, isLoading } = useCheckItems(checkId);

  if (isLoading) {
    return <Text>{t('loading') || 'Loading...'}</Text>;
  }

  if (!items || items.length === 0) {
    return null;
  }

  console.log(items);
  const totalSpent = items.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <VStack space="sm">
      <Text className="text-lg font-semibold">
        {t('checks.items.title') || 'Items Purchased'}
      </Text>

      {items.map(item => (
        <HStack
          key={item.id}
          className="items-center justify-between rounded-md bg-gray-100 px-3 py-2 dark:bg-gray-800">
          <Text className="flex-1">{item.title}</Text>
          <Text className="font-medium">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(item.price || 0)}
          </Text>
        </HStack>
      ))}

      <HStack className="justify-between pt-2">
        <Text className="font-bold">{t('checks.items.total') || 'Total'}</Text>
        <Text className="font-bold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(totalSpent)}
        </Text>
      </HStack>
    </VStack>
  );
};
