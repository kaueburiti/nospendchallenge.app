import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  inviteToChallengeByEmail,
  getInvitationsByChallenge,
  getUserInvitations,
  respondToInvitation,
  getChallengeParticipants,
} from '@/lib/db/repository/invitation';

export const useInviteToChallengeByEmail = (challengeId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => inviteToChallengeByEmail(challengeId, email),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['invitations', challengeId],
      });
    },
  });
};

export const useInvitationsByChallenge = (
  challengeId: number,
  status: 'pending' | 'accepted' | 'declined' = 'pending',
) => {
  return useQuery({
    queryKey: ['invitations', challengeId, status],
    queryFn: () => getInvitationsByChallenge(challengeId, status),
  });
};

export const useUserInvitations = () => {
  return useQuery({
    queryKey: ['invitations', 'user'],
    queryFn: getUserInvitations,
  });
};

export const useRespondToInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invitationId,
      status,
    }: {
      invitationId: number;
      status: 'accepted' | 'declined';
    }) => respondToInvitation(invitationId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['invitations', 'user'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['challenges'],
      });
    },
  });
};
