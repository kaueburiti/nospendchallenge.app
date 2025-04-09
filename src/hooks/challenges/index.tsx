import {
  createChallenge,
  getUserChallenges,
  getChallenge,
  updateChallenge,
  deleteChallenge,
} from '@/lib/db/repository/challenge';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useShowNotification } from '../notifications';
import { router } from 'expo-router';
import { useSession } from '../useSession';
import { Analytics } from '@/lib/analytics';
import { supabase } from '@/lib/supabase';
import { type Tables } from '@/lib/db/database.types';

export const useCreateChallenge = () => {
  const queryClient = useQueryClient();
  const { triggerToast } = useShowNotification();

  return useMutation({
    mutationFn: createChallenge,
    onSuccess: async challenge => {
      Analytics.challenge.created(String(challenge.id), challenge.title);

      triggerToast({
        title: 'Congratulations 🎉',
        description: 'Your challenge has been created successfully',
        action: 'success',
      });

      router.push(`/(protected)/challenge/${challenge.id}`);
      void queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
    onError: error => {
      Analytics.error.occurred(error, 'challenge_creation');

      triggerToast({
        title: 'Oops!',
        description: 'Something went wrong, try again later',
        action: 'error',
      });
      console.log('Challenge creation failed');
      console.error(error);
    },
  });
};

export const useGetChallenges = (limit = 10) => {
  return useQuery({
    queryKey: ['challenges', limit],
    queryFn: () => getUserChallenges(limit),
  });
};

export const useChallenge = (
  id: string,
): UseQueryResult<Tables<'challenges'> | null> => {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: () => getChallenge(id),
  });
};

export const useUpdateChallenge = () => {
  const queryClient = useQueryClient();
  const { triggerToast } = useShowNotification();

  return useMutation({
    mutationFn: updateChallenge,
    onSuccess: async challenge => {
      Analytics.challenge.updated(String(challenge.id), challenge.title);

      triggerToast({
        title: 'Success!',
        description: 'Your challenge has been updated successfully',
        action: 'success',
      });

      void queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
    onError: error => {
      Analytics.error.occurred(error, 'challenge_update');

      triggerToast({
        title: 'Oops!',
        description: 'Something went wrong, try again later',
        action: 'error',
      });
      console.log('Challenge update failed');
      console.error(error);
    },
  });
};

export const useDeleteChallenge = () => {
  const queryClient = useQueryClient();
  const { triggerToast } = useShowNotification();

  return useMutation({
    mutationFn: deleteChallenge,
    onSuccess: async (_, challengeId) => {
      Analytics.challenge.deleted(String(challengeId), 'Deleted Challenge');

      triggerToast({
        title: 'Success!',
        description: 'Your challenge has been deleted successfully',
        action: 'success',
      });

      void queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
    onError: error => {
      Analytics.error.occurred(error, 'challenge_deletion');

      triggerToast({
        title: 'Oops!',
        description: 'Something went wrong, try again later',
        action: 'error',
      });
      console.log('Challenge deletion failed');
      console.error(error);
    },
  });
};

export const useIsChallengeOwner = (challengeId: string) => {
  const { data: challenge } = useChallenge(challengeId);
  const { session } = useSession();

  return challenge?.owner_id === session?.user?.id;
};

export const useLeaveChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (challengeId: number) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('challenge_participants')
        .delete()
        .eq('challenge_id', challengeId)
        .eq('user_id', session.session.user.id);

      if (error) {
        if (error.message.includes('prevent_owner_leaving')) {
          throw new Error('Challenge owners cannot leave their own challenge');
        }
        if (error.message.includes('at least one participant must remain')) {
          throw new Error(
            'Cannot leave: at least one participant must remain in the challenge',
          );
        }
        throw new Error('Failed to leave challenge');
      }
    },
    onSuccess: async (_, challengeId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['challenge', challengeId] }),
        queryClient.invalidateQueries({ queryKey: ['challenges'] }),
      ]);
      router.replace('/(protected)/(tabs)/home');
    },
  });
};
