import {
  createChallenge,
  getUserChallenges,
  getChallenge,
  updateChallenge,
  deleteChallenge,
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

export const useUpdateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateChallenge,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
};

export const useDeleteChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChallenge,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
};
