import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createCheck,
  getUserChecksByChallenge,
} from '@/lib/db/repository/check';

export const useCreateCheck = () => {
  return useMutation({
    mutationFn: createCheck,
    onSuccess: () => {
      console.log('Check created');
    },
    onError: error => {
      console.error(error);
    },
  });
};

export const useGetUserChecksByChallenge = (challengeId: number) => {
  return useQuery({
    queryKey: ['checks', challengeId],
    queryFn: () => getUserChecksByChallenge(challengeId),
  });
};
