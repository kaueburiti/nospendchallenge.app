import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCheck,
  getAllChecksByChallenge,
  getUserChecksByChallenge,
  getChallengeTotalSavings,
  getChallengeSavingsHistory,
  getChallengeTotalSpent,
} from '@/lib/db/repository/check';

export const useCreateCheck = (
  challengeId: number,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  },
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCheck,
    onSuccess: () => {
      console.log('Check created');
      onSuccess?.();

      void queryClient.invalidateQueries({
        queryKey: ['checks', challengeId],
      });
    },
    onError: error => {
      console.error(error);
      onError?.(error);
    },
  });
};

export const useGetUserChecksByChallenge = (challengeId: number) => {
  return useQuery({
    queryKey: ['checks', challengeId],
    queryFn: () => getUserChecksByChallenge(challengeId),
  });
};

export const useGetAllChallengeChecks = (challengeId: number) => {
  return useQuery({
    queryKey: ['checks', challengeId, 'all'],
    queryFn: () => getAllChecksByChallenge(challengeId),
  });
};

export const useGetChallengeTotalSavings = (challengeId: number) => {
  return useQuery({
    queryKey: ['checks', challengeId, 'savings', 'total'],
    queryFn: () => getChallengeTotalSavings(challengeId),
  });
};

export const useGetChallengeTotalSpent = (challengeId: number) => {
  return useQuery({
    queryKey: ['checks', challengeId, 'spent', 'total'],
    queryFn: () => getChallengeTotalSpent(challengeId),
  });
};

export const useGetChallengeSavingsHistory = (challengeId: number) => {
  return useQuery({
    queryKey: ['checks', challengeId, 'savings', 'history'],
    queryFn: () => getChallengeSavingsHistory(challengeId),
  });
};
