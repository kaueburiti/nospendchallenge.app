import React, { useState } from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Button, Heading, Text, VStack, HStack } from '@/components/ui';
import { useLocalSearchParams, router } from 'expo-router';
import { useChallenge, useIsChallengeOwner } from '@/hooks/challenges';
import { Pressable, ScrollView } from 'react-native';
import { PlusCircle, Settings, BadgeCheck } from 'lucide-react-native';
import DaysGrid from '@/components/home/challenges/days-grid';
import ChallengeScores from '@/components/home/challenges/scores';
import CheckModal from '@/components/home/challenges/check/modal';
import ChallengeCover from '@/components/home/challenges/cover';
import ChallengeProgressBar from '@/components/home/challenges/progress';
import BackButton from '@/components/navigation/back-button';
import ChallengeParticipantsList from '@/components/home/challenges/crew';
import { useGetAllChallengeChecks } from '@/hooks/checks';
import { format } from 'date-fns';
import RecentActivities from '@/components/home/recent-activities';

export default function ChallengeDetails() {
  const [isCheckInDrawerOpen, setIsCheckInDrawerOpen] =
    useState<boolean>(false);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);
  const isOwner = useIsChallengeOwner(id);

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

                    {isOwner && (
                      <Button
                        onPress={() => router.push(`/challenge/${id}/edit`)}
                        variant="link"
                        action="secondary">
                        <Settings size={24} color="rgb(82,82,82)" />
                      </Button>
                    )}
                  </Box>

                  <Text className="text-sm">{challenge.description}</Text>
                </Box>
              </VStack>
            </HStack>

            <Box className="flex flex-row items-start justify-between gap-4">
              <Box className="shrink-0">
                <Box className="flex flex-row items-center gap-2">
                  <Heading size="lg" className="mb-1">
                    Participants
                  </Heading>
                  <Pressable
                    onPress={() =>
                      router.push(`/(protected)/challenge/${id}/invite`)
                    }>
                    <PlusCircle size={22} color="rgb(82,82,82)" />
                  </Pressable>
                </Box>
                <ChallengeParticipantsList challengeId={Number(id)} />
              </Box>

              <Box className="grow">
                <Box className="flex flex-row items-center gap-2">
                  <Heading size="lg" className="mb-1">
                    Challenge Progress
                  </Heading>
                </Box>
                <ChallengeProgressBar challenge={challenge} showDates />

                {/* <Box className="flex flex-row items-center gap-2">
                  <Heading size="lg" className="mb-1">
                    Last Checks
                  </Heading>
                  <Pressable
                    onPress={() =>
                      router.push(`/(protected)/challenge/${id}/invite`)
                    }>
                    <PlusCircle size={22} color="rgb(82,82,82)" />
                  </Pressable>
                </Box>

                <Box className="flex-col gap-1">
                  {checks?.map(check => (
                    <Box
                      key={check.id}
                      className="flex flex-row items-center gap-1">
                      <BadgeCheck size={14} color="rgb(82,82,82)" />
                      <Text size="sm" key={check.id}>
                        <Text
                          className="font-bold text-typography-500"
                          size="sm">
                          {check.profiles?.display_name}
                        </Text>{' '}
                        - {format(new Date(check.date), 'MMM d, yyyy')}
                      </Text>
                    </Box>
                  ))}
                </Box> */}
              </Box>
            </Box>

            <ChallengeScores />
            <Box>
              <Button onPress={() => setIsCheckInDrawerOpen(true)} size="lg">
                <Text className="text-white">Create a check In</Text>
              </Button>
            </Box>
            <RecentActivities id={id} />

            <Box>
              <Heading size="xl" className="mb-4">
                My Checks
              </Heading>
              <DaysGrid />
            </Box>
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
