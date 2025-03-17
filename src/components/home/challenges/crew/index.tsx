import React from 'react';
import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
  Box,
  Pressable,
} from '@/components/ui';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { useChallengeParticipants } from '@/hooks/participants';
import { type Tables } from '@/lib/db/database.types';
import classNames from 'classnames';
import { Settings, Settings2 } from 'lucide-react-native';
import { Skeleton } from '@/components/ui/skeleton';

export interface ChallengeParticipantsListProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  challengeId: number;
}
export default function ChallengeParticipantsList({
  size = 'md',
  className,
  challengeId,
}: ChallengeParticipantsListProps) {
  const { data: participants, isLoading } =
    useChallengeParticipants(challengeId);

  if (isLoading) {
    return (
      <Box className="flex flex-row items-center gap-0">
        <Skeleton className="h-10 w-10 rounded-full border-2 border-white" />
        <Skeleton className="-ml-4 h-10 w-10 rounded-full border-2 border-white" />
        <Skeleton className="-ml-4 h-10 w-10 rounded-full border-2 border-white" />
      </Box>
    );
  }

  return (
    <Box className="flex flex-row items-center justify-between">
      <Box className={classNames('flex flex-row gap-4 pl-4', className)}>
        <AvatarGroup>
          {participants?.map(participant => (
            <ChallengeParticipant
              key={participant.id}
              participant={participant}
              size={size}
            />
          ))}
        </AvatarGroup>
      </Box>
    </Box>
  );
}

export function ChallengeParticipant({
  participant,
  size = 'md',
}: {
  participant: Tables<'profiles'>;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <Avatar size={size} className="border-2 border-white">
      <AvatarFallbackText>{participant.display_name}</AvatarFallbackText>
      {participant.avatar_url && (
        <AvatarImage
          source={{
            uri: participant.avatar_url,
          }}
        />
      )}
    </Avatar>
  );
}
