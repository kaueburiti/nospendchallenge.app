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
export const useCreateChallenge = () => {
  const queryClient = useQueryClient();
  const { triggerToast } = useShowToast();

  return useMutation({
    mutationFn: createChallenge,
    onSuccess: () => {
      console.log('Challenge created');
      triggerToast();
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

export const useShowToast = () => {
  const toast = useToast();
  const [toastId, setToastId] = useState<string>('0');

  const triggerToast = () => {
    if (!toast.isActive(toastId)) {
      showNewToast();
    }
  };

  const showNewToast = () => {
    const newId = Math.random().toString();
    setToastId(newId);

    toast.show({
      id: newId,
      placement: 'top',
      duration: null,
      render: ({ id }) => {
        const uniqueToastId = 'toast-' + id;
        return (
          <Toast
            action="success"
            variant="outline"
            nativeID={uniqueToastId}
            className="w-2/3 flex-row justify-between gap-6 border-success-500 p-4 shadow-hard-5">
            <HStack space="md" className="flex-row items-center gap-2">
              <Icon
                as={BadgeCheck}
                className="stroke-success-500"
                width={24}
                size="xl"
                height={24}
              />
              <VStack space="xs">
                <ToastTitle className="font-semibold text-success-500">
                  Congratulations 🎉
                </ToastTitle>
                <ToastDescription size="sm" className="text-gray-500">
                  Challenge successfully created!
                </ToastDescription>
              </VStack>
            </HStack>
            <HStack className="gap-1 min-[450px]:gap-3">
              <Pressable onPress={() => toast.close(id)}>
                <Icon as={CloseIcon} />
              </Pressable>
            </HStack>
          </Toast>
        );
      },
    });
  };

  return { showNewToast, triggerToast };
};
