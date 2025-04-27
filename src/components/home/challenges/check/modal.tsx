import React from 'react';
import { Heading, VStack, Text } from '@/components/ui';
import { CheckInForm } from '@/components/home/challenges/check/form';
import { useTranslation } from '@/hooks/useTranslation';
import { BottomDrawer } from '@/components/BottomDrawer';
import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view';

type CheckModalProps = {
  isOpen: boolean;
  onClose: () => void;
  challengeId: string;
};

export default function CheckModal({
  isOpen,
  onClose,
  challengeId,
}: CheckModalProps) {
  const { t } = useTranslation();

  return (
    <KeyboardAvoidingView behavior="padding">
      <BottomDrawer
        isOpen={isOpen}
        onClose={onClose}
        title={t('checks.form.title')}>
        <VStack space="md" className="w-full">
          <Text>{t('checks.form.description')}</Text>
          <CheckInForm
            challengeId={challengeId}
            onSubmit={onClose}
            onClose={onClose}
          />
        </VStack>
      </BottomDrawer>
    </KeyboardAvoidingView>
  );
}
