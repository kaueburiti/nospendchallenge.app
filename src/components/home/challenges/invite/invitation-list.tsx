import React from 'react';
import { Box, Heading, HStack, Text, VStack } from '@/components/ui';
import { Badge, BadgeText } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
import { type Tables } from '@/lib/db/database.types';

interface InvitationListProps {
  invitations: Tables<'challenge_invitations'>[];
  isLoading: boolean;
}

export default function InvitationList({
  invitations,
  isLoading,
}: InvitationListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <Text>{t('participants.loading')}</Text>;
  }

  if (!invitations || invitations.length === 0) {
    return (
      <Box className="p-4">
        <Text className="text-gray-500">{t('participants.no_invites')}</Text>
      </Box>
    );
  }

  return (
    <VStack space="sm">
      <Heading size="md">{t('participants.pending_invites')}</Heading>
      <VStack space="md">
        {invitations.map(invitation => (
          <HStack
            key={invitation.id}
            className="items-center justify-between rounded-lg bg-gray-100 p-3">
            <VStack>
              <Text className="font-medium">{invitation.invitee_email}</Text>
              <Text className="text-xs text-gray-500">
                {t('common.sent')}{' '}
                {format(new Date(invitation.created_at), 'MMM d, yyyy')}
              </Text>
            </VStack>

            <Badge
              variant="solid"
              action={
                invitation.status === 'accepted'
                  ? 'success'
                  : invitation.status === 'declined'
                    ? 'error'
                    : 'warning'
              }>
              <BadgeText>
                {invitation.status === 'pending'
                  ? t('participants.status.pending')
                  : invitation.status === 'accepted'
                    ? t('participants.status.accepted')
                    : t('participants.status.rejected')}
              </BadgeText>
            </Badge>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
