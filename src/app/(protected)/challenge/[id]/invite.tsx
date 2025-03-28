import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Heading, Divider, HStack, VStack } from '@/components/ui';
import { useLocalSearchParams } from 'expo-router';
import { useChallenge, useIsChallengeOwner } from '@/hooks/challenges';
import InviteForm from '@/components/home/challenges/invite/invite-form';
import InvitationList from '@/components/home/challenges/invite/invitation-list';
import ParticipantList from '@/components/home/challenges/invite/participant-list';
import { ScrollView } from '@/components/ui/scroll-view';
import BackButton from '@/components/navigation/back-button';
import ChallengeProgressBar from '@/components/home/challenges/progress';
import ChallengeCover from '@/components/home/challenges/cover';

export default function InviteToChallengeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);
  const isOwner = useIsChallengeOwner(id);

  if (isLoading || !challenge) {
    return null;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Box className="p-4">
          <BackButton />
          <Heading size="xl" className="mb-4">
            {challenge.title}
          </Heading>
          <HStack space="md" className="mb-6">
            <ChallengeCover challenge={challenge} size="md" />

            <VStack className="flex-1 justify-between">
              <ChallengeProgressBar challenge={challenge} showDates />
            </VStack>
          </HStack>

          <VStack space="md">
            {isOwner && (
              <>
                <InviteForm challengeId={Number(id)} />
                <Divider />
                <InvitationList challengeId={Number(id)} />
                <Divider />
              </>
            )}

            <ParticipantList challengeId={Number(id)} />
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
