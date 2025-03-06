import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Heading, Divider } from '@/components/ui';
import { useLocalSearchParams } from 'expo-router';
import { useChallenge } from '@/hooks/challenges';
import InviteForm from '@/components/home/challenges/invite/invite-form';
import InvitationList from '@/components/home/challenges/invite/invitation-list';
import ParticipantList from '@/components/home/challenges/invite/participant-list';
import { ScrollView } from 'react-native';

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
          <Heading size="xl" className="mb-4">
            Invite to Challenge
          </Heading>
          <Heading size="md" className="mb-2">
            {challenge.title}
          </Heading>
        </Box>

        <InviteForm challengeId={Number(id)} />

        <Divider className="my-4" />

        <ParticipantList challengeId={Number(id)} />

        <Divider className="my-4" />

        <InvitationList challengeId={Number(id)} />
      </ScrollView>
    </SafeAreaView>
  );
}
