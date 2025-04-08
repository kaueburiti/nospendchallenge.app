import React from 'react';
import { Box, Heading, Text, VStack, HStack } from '@/components/ui';
import { useInvitationsByChallenge } from '@/hooks/invitations';
import { format } from 'date-fns';
import { Badge, BadgeText } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
interface InvitationListProps {
  challengeId: number;
}

export default function InvitationList({ challengeId }: InvitationListProps) {
  const { t } = useTranslation();
  const { data: invitations, isLoading } =
    useInvitationsByChallenge(challengeId);

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
    <Box>
      <Heading size="md" className="mb-4">
        {t('participants.pending_invites')}
      </Heading>
      <VStack space="md">
        {invitations.map(invitation => (
          <HStack
            key={invitation.id}
            className="items-center justify-between rounded-lg bg-gray-100 p-3">
            <VStack>
              <Text className="font-medium">{invitation.invitee_email}</Text>
              <Text className="text-xs text-gray-500">
                Sent {format(new Date(invitation.created_at), 'MMM d, yyyy')}
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
                  ? 'Pending'
                  : invitation.status === 'accepted'
                    ? 'Accepted'
                    : 'Declined'}
              </BadgeText>
            </Badge>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
