import React, { useState, useEffect } from 'react';
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
  CheckCheck,
  DollarSign,
  LogOut,
  Settings,
  Users,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import CheckModal from '@/components/home/challenges/check/modal';
import ChallengeCover from '@/components/home/challenges/cover';
import BackButton from '@/components/navigation/back-button';
import ChallengeDetailsTab from '@/components/challenge/details-tab';
import ChallengeParticipantsTab from '@/components/challenge/participants-tab';
import { useIsChallengeOwner } from '@/hooks/challenges/index';
import { useChallenge } from '@/hooks/challenges';
import { useCaptureEvent } from '@/hooks/analytics/useCaptureEvent';
import MoneyTrackerTab from '@/components/challenge/money-tracket-tab';
import classNames from 'classnames';
import ChallengeProgressBar from '@/components/home/challenges/progress';

export default function ChallengeDetails() {
  const [isCheckInDrawerOpen, setIsCheckInDrawerOpen] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    'details' | 'money-tracker' | 'participants'
  >('details');
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);
  const isOwner = useIsChallengeOwner(id);
  const { captureEvent } = useCaptureEvent();

  // Track challenge opened event
  useEffect(() => {
    if (challenge) {
      captureEvent('CHALLENGE_OPENED', {
        challengeId: id,
        title: challenge.title,
        isOwner,
      });
    }
  }, [challenge, id, isOwner, captureEvent]);

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
              <VStack space="xs">
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
              </VStack>

              <ChallengeProgressBar challenge={challenge} showDates />
            </VStack>
          </HStack>

          {/* Tab Navigation */}
          <Box className="flex flex-row border-b border-gray-200">
            <Pressable
              onPress={() => setActiveTab('details')}
              className={classNames('w-1/3 items-center px-4 pb-2', {
                'border-primary border-b-2': activeTab === 'details',
              })}>
              <CheckCheck size={24} color="rgb(82,82,82)" />
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('money-tracker')}
              className={classNames('w-1/3 items-center px-4 pb-2', {
                'border-primary border-b-2': activeTab === 'money-tracker',
              })}>
              <DollarSign size={24} color="rgb(82,82,82)" />
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('participants')}
              className={classNames('w-1/3 items-center px-4 pb-2', {
                'border-primary border-b-2': activeTab === 'participants',
              })}>
              <Users size={24} color="rgb(82,82,82)" />
            </Pressable>
          </Box>
        </Box>

        {/* Tab Content */}
        <Box className="flex-1">
          {activeTab === 'details' ? (
            <ChallengeDetailsTab
              onCheckIn={() => setIsCheckInDrawerOpen(true)}
            />
          ) : activeTab === 'money-tracker' ? (
            <MoneyTrackerTab challengeId={id} />
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
