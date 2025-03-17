import { getChallengeParticipants } from '@/lib/db/repository/invitation';
import { useQuery } from '@tanstack/react-query';
import { useMultipleProfiles } from '../profiles';
import { useChallenge } from '../challenges';

export const useChallengeParticipants = (challengeId: number) => {
  const { data: challenge } = useChallenge(String(challengeId));
  const { data: participants } = useQuery({
    queryKey: ['participants', challengeId],
    queryFn: () => getChallengeParticipants(challengeId),
  });
  const ownerId = challenge?.owner_id ?? '';

  const participantsIds =
    participants?.map(participant => participant.user_id) ?? [];

  return useMultipleProfiles([...participantsIds, ownerId]);
};
