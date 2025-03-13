import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui';
import { useChallengeParticipants } from '@/hooks/invitations';
import { format } from 'date-fns';

interface ParticipantListProps {
  challengeId: number;
}

export default function ParticipantList({ challengeId }: ParticipantListProps) {
  const { data: participants, isLoading } =
    useChallengeParticipants(challengeId);

  if (isLoading) {
    return <Text>Loading participants...</Text>;
  }

  if (!participants || participants.length === 0) {
    return (
      <Box className="p-4">
        <Text className="text-gray-500">No participants yet</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" className="mb-4">
        Participants
      </Heading>
      <VStack space="md">
        {participants.map(participant => (
          <HStack
            key={participant.id}
            className="items-center rounded-lg bg-gray-100 p-3">
            <Avatar className="mr-3">
              {participant.users?.avatar_url ? (
                <AvatarImage source={{ uri: participant.users.avatar_url }} />
              ) : (
                <AvatarFallbackText>
                  {participant.users?.display_name?.substring(0, 2) || 'U'}
                </AvatarFallbackText>
              )}
            </Avatar>
            <VStack>
              <Text className="font-medium">
                {participant.users?.display_name || 'User'}
              </Text>
              <Text className="text-xs text-gray-500">
                Joined {format(new Date(participant.joined_at), 'MMM d, yyyy')}
              </Text>
            </VStack>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
