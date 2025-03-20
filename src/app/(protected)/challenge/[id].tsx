import React, { useState } from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Pressable,
} from '@/components/ui';
import { useLocalSearchParams, router } from 'expo-router';
import { useChallenge, useIsChallengeOwner } from '@/hooks/challenges';
import { ScrollView } from 'react-native';
import { Settings } from 'lucide-react-native';
import CheckModal from '@/components/home/challenges/check/modal';
import ChallengeCover from '@/components/home/challenges/cover';
import BackButton from '@/components/navigation/back-button';
import ChallengeDetailsTab from '@/components/challenge/details-tab';
import ChallengeActivitiesTab from '@/components/challenge/activities-tab';
import ChallengeParticipantsTab from '@/components/challenge/participants-tab';

export default function ChallengeDetails() {
  const [isCheckInDrawerOpen, setIsCheckInDrawerOpen] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'details' | 'activities' | 'participants'
  >('details');
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
      <Box className="flex-1">
        <Box className="p-4">
          <BackButton />
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

          {/* Tab Navigation */}
          <HStack className="mb-4 border-b border-gray-200">
            <Pressable
              onPress={() => setActiveTab('details')}
              className={`flex-1 items-center pb-2 ${
                activeTab === 'details' ? 'border-primary border-b-2' : ''
              }`}>
              <Text
                className={`font-medium ${
                  activeTab === 'details' ? 'text-primary' : 'text-gray-500'
                }`}>
                Details
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('activities')}
              className={`flex-1 items-center pb-2 ${
                activeTab === 'activities' ? 'border-primary border-b-2' : ''
              }`}>
              <Text
                className={`font-medium ${
                  activeTab === 'activities' ? 'text-primary' : 'text-gray-500'
                }`}>
                Activities
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('participants')}
              className={`flex-1 items-center pb-2 ${
                activeTab === 'participants' ? 'border-primary border-b-2' : ''
              }`}>
              <Text
                className={`font-medium ${
                  activeTab === 'participants'
                    ? 'text-primary'
                    : 'text-gray-500'
                }`}>
                Participants
              </Text>
            </Pressable>
          </HStack>
        </Box>

        {/* Tab Content */}
        <Box className="flex-1">
          {activeTab === 'details' ? (
            <ChallengeDetailsTab
              challenge={challenge}
              challengeId={id}
              isOwner={isOwner}
              onCheckIn={() => setIsCheckInDrawerOpen(true)}
            />
          ) : activeTab === 'activities' ? (
            <ChallengeActivitiesTab challengeId={id} />
          ) : (
            <ChallengeParticipantsTab challengeId={Number(id)} />
          )}
        </Box>
      </Box>

      <CheckModal
        isOpen={isCheckInDrawerOpen}
        onClose={() => setIsCheckInDrawerOpen(false)}
        challengeId={id}
      />
    </SafeAreaView>
  );
}
