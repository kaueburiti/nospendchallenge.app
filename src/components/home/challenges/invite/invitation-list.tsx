import React from 'react';
import { Box, Heading, Text, VStack, HStack } from '@/components/ui';
import { useInvitationsByChallenge } from '@/hooks/invitations';
import { format } from 'date-fns';
import { Badge, BadgeText } from '@/components/ui/badge';
interface InvitationListProps {
  challengeId: number;
}

export default function InvitationList({ challengeId }: InvitationListProps) {
  const { data: invitations, isLoading } =
    useInvitationsByChallenge(challengeId);

  if (isLoading) {
    return <Text>Loading pending invitations...</Text>;
  }

  if (!invitations || invitations.length === 0) {
    return (
      <Box className="p-4">
        <Text className="text-gray-500">No invitations sent yet</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" className="mb-4">
        Pending Invitations
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
