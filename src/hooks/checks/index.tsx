import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCheck,
  getUserChecksByChallenge,
} from '@/lib/db/repository/check';
import { useShowNotification } from '../notifications';

export const useCreateCheck = (challengeId: number) => {
  const { triggerToast } = useShowNotification();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCheck,
    onSuccess: () => {
      console.log('Check created');
      // BUG: The toast is not showing when the check is created
      triggerToast({
        title: 'Check created',
        description: 'Check created successfully',
        action: 'success',
      });

      void queryClient.invalidateQueries({
        queryKey: ['checks', challengeId],
      });
    },
    onError: error => {
      console.error(error);
      triggerToast({
        title: 'Failed to create check',
        description: 'Failed to create check',
        action: 'error',
      });
    },
  });
};

export const useGetUserChecksByChallenge = (challengeId: number) => {
  return useQuery({
    queryKey: ['checks', challengeId],
    queryFn: () => getUserChecksByChallenge(challengeId),
  });
};
