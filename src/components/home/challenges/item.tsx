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
        <Box className="flex flex-row gap-4">
          <AvatarGroup>
            <Avatar size="sm" className="border-2 border-white">
              <AvatarFallbackText>John Doe</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                }}
              />
            </Avatar>
            <Avatar size="sm" className="border-2 border-white">
              <AvatarFallbackText>John Doe</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                }}
              />
            </Avatar>
            <Avatar size="sm" className="border-2 border-white">
              <AvatarFallbackText>John Doe</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: 'https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                }}
              />
            </Avatar>
          </AvatarGroup>
        </Box>
      </Box>
    </Pressable>
  );
}

export default ChallengeItem;
