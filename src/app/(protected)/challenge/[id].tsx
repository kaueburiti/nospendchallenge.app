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
  Image,
  VStack,
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

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
        <Box className="px-4 pb-16 pt-10">
          {/* <Button onPress={() => router.back()} className="mb-4">
            <Text>Back</Text>
          </Button> */}

          <VStack space="md">
            <Box className="h-32 w-full overflow-hidden rounded-md bg-black">
              <Image
                source={{
                  uri: challenge.cover!,
                }}
                alt={String(challenge.title)}
                className="h-full w-full opacity-70"
              />

              <Box className="absolute left-4 top-4 flex flex-row items-center justify-between">
                <Heading size="2xl" className="text-white">
                  {challenge.title}
                </Heading>
                <Button
                  onPress={() => router.push(`/challenge/${id}/edit`)}
                  variant="outline"
                  action="secondary">
                  <Settings size={24} color="white" />
                </Button>
              </Box>

              <Box className="absolute right-4 top-1/2 aspect-square h-24 w-24 -translate-y-1/2 items-center justify-center rounded-full text-center text-4xl font-bold text-white">
                <Text className="text-center text-4xl font-bold text-white">
                  94%
                </Text>
              </Box>

              <Box className="absolute bottom-0 left-0 right-0 h-10 w-full px-4">
                <Progress
                  value={80}
                  size="2xl"
                  orientation="horizontal"
                  className="w-full">
                  <ProgressFilledTrack />
                </Progress>
              </Box>
            </Box>

            <Box className="flex flex-row items-center justify-between">
              <Box className="">
                <Heading size="lg">Challenge Crew</Heading>
                <Box className="flex flex-row gap-4 pl-4">
                  <AvatarGroup>
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
