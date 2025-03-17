import { CloseIcon } from '@/components/ui/icon';
import { ToastDescription, HStack, VStack } from '@/components/ui';
import { Icon } from '@/components/ui/icon';
import { Toast, ToastTitle, useToast } from '@/components/ui/toast';
import {
  createChallenge,
  getUserChallenges,
  getChallenge,
  updateChallenge,
  deleteChallenge,
} from '@/lib/db/repository/challenge';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useState } from 'react';
import { useShowNotification } from '../notifications';
import { router } from 'expo-router';
import { useSimpleToast } from '../useSimpleToast';

export const useCreateChallenge = () => {
  const queryClient = useQueryClient();
  const { triggerToast } = useShowNotification();

  return useMutation({
    mutationFn: createChallenge,
    onSuccess: async challenge => {
      triggerToast({
        title: 'Congratulations 🎉',
        description: 'Your challenge has been created successfully',
        action: 'success',
      });

      router.push(`/(protected)/challenge/${challenge.id}`);
      void queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
    onError: error => {
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

export const useChallenge = (id: string) => {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: () => getChallenge(id),
  });
};

export const useUpdateChallenge = () => {
  const { triggerToast } = useShowNotification();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateChallenge,
    onSuccess: async challenge => {
      triggerToast({
        title: 'Challenge updated!',
        description: 'Your challenge has been updated successfully',
        action: 'success',
      });
      router.push(`/(protected)/challenge/${challenge.id}`);
      void queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
    onError: error => {
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

export const useDeleteChallenge = () => {
  const queryClient = useQueryClient();
  const { showToast } = useSimpleToast();

  return useMutation({
    mutationFn: deleteChallenge,
    onSuccess: () => {
      showToast(
        'success',
        'Challenge deleted!',
        'Your challenge has been deleted successfully',
      );
      void queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
    onError: error => {
      showToast('error', 'Oops!', 'Something went wrong, try again later');
      console.error(error);
    },
  });
};
