import React from 'react';
import type { Tables } from '@/lib/db/database.types';
import { AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Avatar } from '@/components/ui/avatar';

function ChallengeCover({
  challenge,
  size,
}: {
  challenge: Tables<'challenges'>;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}) {
  return (
    <Avatar size={size} className="border-2 border-white">
      <AvatarFallbackText>{challenge.title}</AvatarFallbackText>
      <AvatarImage
        className="rounded-md"
        alt={String(challenge.title)}
        source={{
          uri: challenge.cover!,
        }}
      />
    </Avatar>
  );
}

export default ChallengeCover;
