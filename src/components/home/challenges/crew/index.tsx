import React from 'react';
import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
  Box,
  Pressable,
} from '@/components/ui';
import { router } from 'expo-router';
import { useChallengeParticipants } from '@/hooks/participants';
import { type Tables } from '@/lib/db/database.types';
import classNames from 'classnames';

export interface ChallengeParticipantsListProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  challengeId: number;
  showInviteButton?: boolean;
}
export default function ChallengeParticipantsList({
  size = 'md',
  className,
  challengeId,
  showInviteButton = true,
}: ChallengeParticipantsListProps) {
  const { data: participants } = useChallengeParticipants(challengeId);

  if (!participants) return null;

  const inviteButton = showInviteButton ? (
    <Avatar size={size} className="border-2 border-white" key="invite-button">
      <Pressable
        onPress={() =>
          router.push(`/(protected)/challenge/${challengeId}/invite`)
        }>
        <AvatarFallbackText>+</AvatarFallbackText>
      </Pressable>
    </Avatar>
  ) : (
    <></>
  );

  console.log(participants.length);

  return (
    <Box className={classNames('flex flex-row gap-4 pl-4', className)}>
      <AvatarGroup>
        {[
          inviteButton,
          ...(participants?.map(participant => (
            <ChallengeParticipant
              key={participant.id}
              participant={participant}
              size={size}
            />
          )) ?? []),
        ]}
      </AvatarGroup>
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
