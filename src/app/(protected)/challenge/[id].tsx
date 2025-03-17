import React, { useState } from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  ButtonText,
} from '@/components/ui';
import { useLocalSearchParams, router } from 'expo-router';
import { useChallenge } from '@/hooks/challenges';
import { ScrollView } from 'react-native';
import { Settings } from 'lucide-react-native';
import DaysGrid from '@/components/home/challenges/days-grid';
import ChallengeScores from '@/components/home/challenges/scores';
import CheckModal from '@/components/home/challenges/check/modal';
import ChallengeCover from '@/components/home/challenges/cover';
import ChallengeProgressBar from '@/components/home/challenges/progress';
import BackButton from '@/components/navigation/back-button';
import { useSession } from '@/hooks/useSession';
import ChallengeParticipantsList from '@/components/home/challenges/crew';

export default function ChallengeDetails() {
  const [isCheckInDrawerOpen, setIsCheckInDrawerOpen] =
    useState<boolean>(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);
  const { user } = useSession();
  const userIsOwner = user?.id === challenge?.owner_id;

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
        <Box className="p-4 pb-16">
          <BackButton />
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

                <ChallengeProgressBar challenge={challenge} showDates />
              </VStack>
            </HStack>

            <Box className="flex flex-row items-center justify-between">
              <Box className="">
                <Heading size="lg">Challenge Crew</Heading>
                <ChallengeParticipantsList challengeId={Number(id)} />

                {userIsOwner && (
                  <Button
                    onPress={() =>
                      router.push(`/(protected)/challenge/${id}/invite`)
                    }
                    className="mt-4">
                    <ButtonText>Invite Friends</ButtonText>
                  </Button>
                )}
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
