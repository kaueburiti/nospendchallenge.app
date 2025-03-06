import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  ButtonText,
} from '@/components/ui';
import {
  useUserInvitations,
  useRespondToInvitation,
} from '@/hooks/invitations';
import { format } from 'date-fns';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export default function PendingInvitations() {
  const { data: invitations, isLoading } = useUserInvitations();
  const { mutate: respondToInvitation } = useRespondToInvitation();

  if (isLoading) {
    return null;
  }

  if (!invitations || invitations.length === 0) {
    return null;
  }

  const handleAccept = (invitationId: number) => {
    respondToInvitation(
      { invitationId, status: 'accepted' },
      {
        onSuccess: () => {
          Alert.alert('Success', 'You have joined the challenge!');
        },
        onError: error => {
          Alert.alert('Error', error.message);
        },
      },
    );
  };

  const handleDecline = (invitationId: number) => {
    respondToInvitation(
      { invitationId, status: 'declined' },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Invitation declined');
        },
        onError: error => {
          Alert.alert('Error', error.message);
        },
      },
    );
  };

  return (
    <Box className="mb-4 p-4">
      <Heading size="lg" className="mb-4">
        Pending Invitations
      </Heading>
      <VStack space="md">
        {invitations.map(invitation => (
          <Box key={invitation.id} className="rounded-lg bg-gray-100 p-4">
            <Text className="mb-1 font-bold">
              {invitation.challenges?.title}
            </Text>
            <Text className="mb-3 text-sm text-gray-600">
              Starts{' '}
              {format(
                new Date(invitation.challenges?.start_date || ''),
                'MMM d, yyyy',
              )}
            </Text>

            <HStack className="mt-2 justify-between">
              <Button
                size="sm"
                variant="outline"
                action="negative"
                onPress={() => handleDecline(invitation.id)}>
                <ButtonText>Decline</ButtonText>
              </Button>

              <Button size="sm" onPress={() => handleAccept(invitation.id)}>
                <ButtonText>Accept</ButtonText>
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
