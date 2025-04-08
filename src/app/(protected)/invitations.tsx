import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Heading, Text, VStack } from '@/components/ui';
import { useUserInvitations } from '@/hooks/invitations';
import PendingInvitations from '@/components/home/challenges/invite/pending-invitations';
import { ScrollView } from '@/components/ui/scroll-view';
import { useTranslation } from '@/hooks/useTranslation';

export default function InvitationsScreen() {
  const { t } = useTranslation();
  const { data: invitations, isLoading } = useUserInvitations();

  return (
    <SafeAreaView>
      <ScrollView>
        <Box className="p-4">
          <Heading size="2xl" className="mb-2">
            {t('invitations.title')}
          </Heading>
          <Text className="mb-6 text-gray-500">
            {t('invitations.description')}
          </Text>

          {isLoading ? (
            <Text>{t('invitations.loading')}</Text>
          ) : !invitations || invitations.length === 0 ? (
            <Box className="items-center justify-center rounded-lg bg-gray-100 p-8">
              <Text className="text-center text-gray-500">
                {t('invitations.no_invitations')}
              </Text>
            </Box>
          ) : (
            <VStack space="md">
              <PendingInvitations />
            </VStack>
          )}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
