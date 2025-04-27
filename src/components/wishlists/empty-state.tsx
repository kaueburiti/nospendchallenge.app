import React from 'react';
import { Box, Heading, Text, VStack } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

export default function EmptyWishlists() {
  const { t } = useTranslation();

  return (
    <Box className="flex-1 items-center justify-center py-12">
      <VStack space="lg" className="items-center">
        <Text className="mb-2 text-4xl">📋</Text>
        <Heading size="lg" className="text-center">
          {t('wishlists.no_items')}
        </Heading>
        <Text className="max-w-xs text-center text-gray-500">
          {t('wishlists.no_items_description')}
        </Text>
      </VStack>
    </Box>
  );
}
