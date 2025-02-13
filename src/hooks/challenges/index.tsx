import {
  createChallenge,
  getUserChallenges,
  getChallenge,
} from '@/lib/db/repository/challenge';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
export const useCreateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChallenge,
    onSuccess: () => {
      console.log('Challenge created');
      void queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
    onError: error => {
      console.error(error);
    },
  });
};

export const useGetChallenges = () => {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: getUserChallenges,
  });
};

export const useChallenge = (id: string) => {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: () => getChallenge(id),
  });
};
