import React from 'react';
import { Box, HStack, VStack, Text, Heading } from '@/components/ui';
import { Trophy } from 'lucide-react-native';
import { useBiggestStrike } from '@/hooks/useBiggestStrike';
import { HomeWidgetWrapper } from './wrapper';
import { useTranslation } from '@/hooks/useTranslation';

export const CurrentStrikeWidget = () => {
  const { data: biggestStrike, isLoading } = useBiggestStrike();
  const { t } = useTranslation();

  return (
    <HomeWidgetWrapper>
      <HStack space="md" className="items-center">
        <Box className="rounded-full bg-primary-100 p-2">
          <Trophy size={24} color="white" />
        </Box>
        <VStack space="xs">
          <Heading size="xs" className="mb-0 font-normal">
            {t('widgets.current_strike.title')}
          </Heading>
          <Text className="text-2xl font-bold">
            {isLoading
              ? '...'
              : `${biggestStrike ?? 0} ${t('widgets.current_strike.days')}`}
          </Text>
        </VStack>
      </HStack>
    </HomeWidgetWrapper>
  );
};
