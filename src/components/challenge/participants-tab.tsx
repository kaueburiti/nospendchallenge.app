import React from 'react';
import { Box, Heading, Text, VStack, HStack } from '@/components/ui';
import { useChallengeParticipants } from '@/hooks/participants';
import { type Tables } from '@/lib/db/database.types';
import { useChallenge, useIsChallengeOwner } from '@/hooks/challenges';
import { Badge } from '@/components/ui/badge';
import InviteForm from '../home/challenges/invite/invite-form';
import InvitationList from '../home/challenges/invite/invitation-list';
import { useTranslation } from '@/hooks/useTranslation';
import { useInvitationsByChallenge } from '@/hooks/invitations';
import { ShareChallengeButton } from './ShareChallengeButton';
import ChallengeActivities from './activities-tab';
interface ChallengeParticipantsTabProps {
  challengeId: number;
}

export default function ChallengeParticipantsTab({
  challengeId,
}: ChallengeParticipantsTabProps) {
  const { data: challenge } = useChallenge(String(challengeId));
  const { t } = useTranslation();
  const { data: participants, isLoading } =
    useChallengeParticipants(challengeId);
  const isOwner = useIsChallengeOwner(String(challengeId));
  const { data: challengeInvitations } = useInvitationsByChallenge(
    challengeId,
    'pending',
  );

  if (isLoading) {
    return <Text>{t('participants.loading')}</Text>;
  }

  if (!participants || participants.length === 0) {
    return (
      <Box className="p-4">
        <Text className="text-gray-500">
          {t('participants.no_participants')}
        </Text>
      </Box>
    );
  }

  return (
    <Box className="p-4 pt-0">
      <VStack space="4xl">
        <VStack space="md">
          <VStack>
            <Heading size="md" className="mb-4">
              {t('participants.title')}
            </Heading>

            {participants.map(participant => (
              <ChallengeParticipant
                key={participant.id}
                participant={participant}
                challengeId={challengeId}
              />
            ))}
          </VStack>
          {challenge && <ShareChallengeButton challenge={challenge} />}
        </VStack>

        <ChallengeActivities challengeId={String(challengeId)} />
      </VStack>
    </Box>
  );
}

export function ChallengeParticipant({
  participant,
  challengeId,
}: {
  participant: Tables<'profiles'>;
  challengeId: number;
}) {
  const { t } = useTranslation();
  const { data: challenge } = useChallenge(String(challengeId));
  const isOwner = challenge?.owner_id === participant.id;

  return (
    <HStack
      key={participant.id}
      className="mb-2 items-center rounded-lg border border-gray-200 bg-gray-100 p-3">
      <HStack className="flex-1 justify-between">
        <Text className="font-medium">{participant.display_name}</Text>

        {isOwner && (
          <Badge variant="outline" className="rounded-lg">
            <Text className="text-2xs">
              {t('participants.participant_owner')}
            </Text>
          </Badge>
        )}
      </HStack>
    </HStack>
  );
}
