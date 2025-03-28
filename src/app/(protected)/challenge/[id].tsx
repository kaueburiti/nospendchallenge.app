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
import {
  BellRing,
  CheckCheck,
  CheckCircle2,
  Grid2x2Check,
  MessageCircle,
  Settings,
  Users,
} from 'lucide-react-native';
import CheckModal from '@/components/home/challenges/check/modal';
import ChallengeCover from '@/components/home/challenges/cover';
import BackButton from '@/components/navigation/back-button';
import ChallengeDetailsTab from '@/components/challenge/details-tab';
import ChallengeActivitiesTab from '@/components/challenge/activities-tab';
import ChallengeParticipantsTab from '@/components/challenge/participants-tab';
import ChallengeChatTab from '@/components/challenge/chat-tab';

export default function ChallengeDetails() {
  const [isCheckInDrawerOpen, setIsCheckInDrawerOpen] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'details' | 'activities' | 'participants' | 'chat'
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
          <Box className="flex flex-row border-b border-gray-200">
            <Pressable
              onPress={() => setActiveTab('details')}
              className={`w-1/4 items-center px-4 pb-2 ${
                activeTab === 'details' ? 'border-primary border-b-2' : ''
              }`}>
              <CheckCheck size={24} color="rgb(82,82,82)" />
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('chat')}
              className={`w-1/4 items-center px-4 pb-2 ${
                activeTab === 'chat' ? 'border-primary border-b-2' : ''
              }`}>
              <MessageCircle size={24} color="rgb(82,82,82)" />
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('activities')}
              className={`w-1/4 items-center px-4 pb-2 ${
                activeTab === 'activities' ? 'border-primary border-b-2' : ''
              }`}>
              <BellRing size={24} color="rgb(82,82,82)" />
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('participants')}
              className={`w-1/4 items-center px-4 pb-2 ${
                activeTab === 'participants' ? 'border-primary border-b-2' : ''
              }`}>
              <Users size={24} color="rgb(82,82,82)" />
            </Pressable>
          </Box>
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
          ) : activeTab === 'chat' ? (
            <ChallengeChatTab challengeId={id} />
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
