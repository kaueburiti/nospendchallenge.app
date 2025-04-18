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
import { Alert } from 'react-native';
import {
  BellRing,
  CheckCheck,
  LogOut,
  MessageCircle,
  Settings,
  Users,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import CheckModal from '@/components/home/challenges/check/modal';
import ChallengeCover from '@/components/home/challenges/cover';
import BackButton from '@/components/navigation/back-button';
import ChallengeDetailsTab from '@/components/challenge/details-tab';
import ChallengeActivitiesTab from '@/components/challenge/activities-tab';
import ChallengeParticipantsTab from '@/components/challenge/participants-tab';
import ChallengeChatTab from '@/components/challenge/chat-tab';
import { useIsChallengeOwner } from '@/hooks/challenges/index';
import { useChallenge } from '@/hooks/challenges';

export default function ChallengeDetails() {
  const [isCheckInDrawerOpen, setIsCheckInDrawerOpen] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'details' | 'activities' | 'participants' | 'chat'
  >('details');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);
  const isOwner = useIsChallengeOwner(id);

  const handleLeaveChallenge = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('challenge_participants')
        .delete()
        .eq('challenge_id', Number(id))
        .eq('user_id', session.session.user.id);

      if (error) {
        throw new Error(error.message);
      }

      router.replace('/(protected)/(tabs)/home');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const confirmLeaveChallenge = () => {
    Alert.alert(
      'Leave Challenge',
      'Are you sure you want to leave this challenge? This action cannot be undone. Your checks and chat messages will be deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: handleLeaveChallenge,
        },
      ],
    );
  };

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

                  {isOwner ? (
                    <Button
                      onPress={() => router.push(`/challenge/${id}/edit`)}
                      variant="link"
                      action="secondary">
                      <Settings size={24} color="rgb(82,82,82)" />
                    </Button>
                  ) : (
                    <Button
                      onPress={confirmLeaveChallenge}
                      variant="link"
                      action="secondary">
                      <LogOut size={24} color="rgb(82,82,82)" />
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
