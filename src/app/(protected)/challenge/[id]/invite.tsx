import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import {
  Box,
  Heading,
  Divider,
  HStack,
  VStack,
  Button,
  Text,
} from '@/components/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useChallenge } from '@/hooks/challenges';
import InviteForm from '@/components/home/challenges/invite/invite-form';
import InvitationList from '@/components/home/challenges/invite/invitation-list';
import ParticipantList from '@/components/home/challenges/invite/participant-list';
import { ScrollView } from 'react-native';
import BackButton from '@/components/navigation/back-button';
import ChallengeProgressBar from '@/components/home/challenges/progress';
import ChallengeCover from '@/components/home/challenges/cover';
import { Settings } from 'lucide-react-native';

export default function InviteToChallengeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);

  if (isLoading || !challenge) {
    return null;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Box className="p-4">
          <BackButton />
          <Heading size="xl" className="mb-4">
            Invite a friend to {challenge.title}
          </Heading>
          <HStack space="md" className="mb-6">
            <ChallengeCover challenge={challenge} size="md" />

            <VStack className="flex-1 justify-between">
              <ChallengeProgressBar challenge={challenge} showDates />
            </VStack>
          </HStack>

          <VStack space="md">
            <InviteForm challengeId={Number(id)} />

            <Divider />

            <ParticipantList challengeId={Number(id)} />

            <Divider />

            <InvitationList challengeId={Number(id)} />
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
