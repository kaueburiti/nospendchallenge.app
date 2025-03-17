import React from 'react';
import { Pressable } from 'react-native';
import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
  Box,
  Heading,
  VStack,
} from '@/components/ui';
import { router } from 'expo-router';
import type { Tables } from '@/lib/db/database.types';
import ChallengeCover from './cover';
import ChallengeProgressBar from './progress';
import ChallengeParticipantsList from './crew';

function ChallengeItem({ challenge }: { challenge: Tables<'challenges'> }) {
  return (
    <Pressable
      className="w-full"
      onPress={() => router.push(`/challenge/${challenge.id}`)}>
      <Box className="flex w-full flex-row justify-between gap-10">
        <Box className="flex flex-1 flex-row gap-4">
          <ChallengeCover challenge={challenge} size="lg" />
          <VStack space="xs" className="flex-1">
            <Heading>{challenge.title}</Heading>
            <ChallengeProgressBar challenge={challenge} />
          </VStack>
        </Box>
        <ChallengeParticipantsList
          showInviteButton={false}
          size="sm"
          challengeId={challenge.id}
        />
      </Box>
    </Pressable>
  );
}

export default ChallengeItem;
