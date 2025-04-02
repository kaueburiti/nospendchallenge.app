import React from 'react';
import { VStack } from '@/components/ui';
import { Text } from '@/components/ui';
import { Button, ButtonText } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { router } from 'expo-router';

export default function EmptyActivities() {
  const { t } = useTranslation();

  return (
    <VStack className="flex-1 items-center justify-center p-4">
      <Text className="mb-2 text-xl font-bold">{t('empty.no_activities')}</Text>
      <Text className="mb-6 text-center text-gray-500">
        {t('empty.create_first')}
      </Text>
      <Button
        variant="solid"
        size="lg"
        className="w-full"
        onPress={() => router.push('/create-challenge')}>
        <ButtonText>{t('empty.start_challenge')}</ButtonText>
      </Button>
    </VStack>
  );
}
