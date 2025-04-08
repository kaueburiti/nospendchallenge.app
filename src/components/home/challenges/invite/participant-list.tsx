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
import { useChallengeParticipants } from '@/hooks/participants';
import { type Tables } from '@/lib/db/database.types';
import { useChallenge } from '@/hooks/challenges';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
interface ParticipantListProps {
  challengeId: number;
}

export default function ParticipantList({ challengeId }: ParticipantListProps) {
  const { t } = useTranslation();
  const { data: participants, isLoading } =
    useChallengeParticipants(challengeId);

  if (isLoading) {
    return <Text>{t('participants.loading')}</Text>;
  }

  if (!participants || participants.length === 0) {
    return (
      <Box className="p-4">
        <Text className="text-gray-500">
          {t('participants.no_participants')}
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" className="mb-4">
        {t('participants.title')}
      </Heading>
      <VStack space="md">
        {participants.map(participant => (
          <ChallengeParticipant
            key={participant.id}
            participant={participant}
            challengeId={challengeId}
          />
        ))}
      </VStack>
    </Box>
  );
}

export function ChallengeParticipant({
  participant,
  challengeId,
}: {
  participant: Tables<'profiles'>;
  challengeId: number;
}) {
  const { data: challenge } = useChallenge(String(challengeId));
  const isOwner = challenge?.owner_id === participant.id;
  const { t } = useTranslation();

  return (
    <HStack
      key={participant.id}
      className="items-center rounded-lg border border-gray-200 bg-gray-100 p-3">
      <Avatar className="mr-3" size="sm">
        {participant.avatar_url ? (
          <AvatarImage source={{ uri: participant.avatar_url }} />
        ) : (
          <AvatarFallbackText>
            {participant.display_name?.substring(0, 2)}
          </AvatarFallbackText>
        )}
      </Avatar>
      <HStack className="flex-1 justify-between">
        <Text className="font-medium">{participant.display_name}</Text>

        {isOwner && (
          <Badge variant="outline" className="rounded-lg">
            <Text className="text-2xs">
              {t('participants.participant_owner')}
            </Text>
          </Badge>
        )}
      </HStack>
    </HStack>
  );
}
