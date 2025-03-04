import React, { useState } from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
} from '@/components/ui';
import { useLocalSearchParams, router } from 'expo-router';
import { useChallenge } from '@/hooks/challenges';
import { ScrollView } from 'react-native';
import { ProgressFilledTrack } from '@/components/ui/progress';
import { Progress } from '@/components/ui/progress';
import { Settings } from 'lucide-react-native';
import DaysGrid from '@/components/home/challenges/days-grid';
import ChallengeScores from '@/components/home/challenges/scores';
import CheckModal from '@/components/home/challenges/check/modal';
import ChallengeCover from '@/components/home/challenges/cover';
import { differenceInDays, format } from 'date-fns';

export default function ChallengeDetails() {
  const [isCheckInDrawerOpen, setIsCheckInDrawerOpen] =
    useState<boolean>(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);

  if (isLoading) {
    return (
      <SafeAreaView>
        <Box className="p-4">
          <Text>Loading...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (!challenge) {
    return (
      <SafeAreaView>
        <Box className="p-4">
          <Text>Challenge not found</Text>
        </Box>
      </SafeAreaView>
    );
  }

  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  const today = new Date();
  const daysPassed = differenceInDays(today, startDate);
  const percentage = Math.max(
    5,
    (daysPassed / differenceInDays(endDate, startDate)) * 100,
  );

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Box className="px-4 pb-16 pt-10">
          <VStack space="lg">
            <HStack space="md" className="mb-6">
              <ChallengeCover challenge={challenge} size="2xl" />

              <VStack className="flex-1 justify-between">
                <Box>
                  <Box className="flex flex-row items-center justify-between">
                    <Heading size="2xl">{challenge.title}</Heading>
                    <Button
                      onPress={() => router.push(`/challenge/${id}/edit`)}
                      variant="link"
                      action="secondary">
                      <Settings size={24} color="rgb(82,82,82)" />
                    </Button>
                  </Box>

                  <Text className="text-sm">{challenge.description}</Text>
                </Box>

                <VStack className="justify-between gap-1">
                  <HStack className="justify-between">
                    <Text className="text-xs font-bold">
                      {format(new Date(challenge.start_date), 'MMM d, yyyy')}
                    </Text>
                    <Text className="text-xs font-bold">
                      {format(new Date(challenge.end_date), 'MMM d, yyyy')}
                    </Text>
                  </HStack>

                  <Box className="w-full">
                    <Progress
                      value={percentage}
                      size="2xl"
                      orientation="horizontal"
                      className="w-full">
                      <ProgressFilledTrack />
                    </Progress>
                  </Box>
                </VStack>
              </VStack>
            </HStack>

            <Box className="flex flex-row items-center justify-between">
              <Box className="">
                <Heading size="lg">Challenge Crew</Heading>
                <Box className="flex flex-row gap-4 pl-4">
                  <AvatarGroup>
                    <Avatar size="md" className="border-2 border-white">
                      <AvatarFallbackText>+</AvatarFallbackText>
                    </Avatar>
                    <Avatar size="md" className="border-2 border-white">
                      <AvatarFallbackText>John Doe</AvatarFallbackText>
                      <AvatarImage
                        source={{
                          uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                        }}
                      />
                    </Avatar>
                    <Avatar size="md" className="border-2 border-white">
                      <AvatarFallbackText>John Doe</AvatarFallbackText>
                      <AvatarImage
                        source={{
                          uri: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
                        }}
                      />
                    </Avatar>
                    <Avatar size="md" className="border-2 border-white">
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
              <Box className="mt-4">
                <Button onPress={() => setIsCheckInDrawerOpen(true)} size="lg">
                  <Text className="text-white">Check In</Text>
                </Button>
              </Box>
            </Box>

            <ChallengeScores />
            <DaysGrid />
          </VStack>
        </Box>
      </ScrollView>

      <CheckModal
        isOpen={isCheckInDrawerOpen}
        onClose={() => setIsCheckInDrawerOpen(false)}
        challengeId={id}
      />
    </SafeAreaView>
  );
}
