import { CloseIcon } from '@/components/ui/icon';
import { ToastDescription, HStack, VStack } from '@/components/ui';
import { Icon } from '@/components/ui/icon';
import { Toast, ToastTitle, useToast } from '@/components/ui/toast';
import { BadgeAlert, BadgeCheck, BadgeInfo, BadgeX } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useState } from 'react';

interface useShowNotificationProps {
  title: string;
  description: string;
  action: 'success' | 'error' | 'warning' | 'info';
}

export const useShowNotification = () => {
  const toast = useToast();
  const [toastId, setToastId] = useState<string>('0');

  const triggerToast = ({
    title,
    description,
    action,
  }: useShowNotificationProps) => {
    if (!toast.isActive(toastId)) {
      showNewToast({
        title,
        description,
        action,
      });
    }
  };

  const getIcon = (action: 'success' | 'error' | 'warning' | 'info') => {
    switch (action) {
      case 'success':
        return BadgeCheck;
      case 'error':
        return BadgeX;
      case 'warning':
        return BadgeAlert;
      case 'info':
        return BadgeInfo;
      default:
        return BadgeCheck;
    }
  };

  const getColor = (action: 'success' | 'error' | 'warning' | 'info') => {
    switch (action) {
      case 'success':
        return 'text-success-500';
      case 'error':
        return 'text-error-500';
      case 'warning':
        return 'text-warning-500';
      case 'info':
        return 'text-info-500';
      default:
        return 'text-success-500';
    }
  };

  const showNewToast = ({
    title,
    description,
    action,
  }: useShowNotificationProps) => {
    const newId = Math.random().toString();
    setToastId(newId);

    toast.show({
      id: newId,
      placement: 'top',
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = 'toast-' + id;
        return (
          <Toast
            action={action}
            variant="outline"
            nativeID={uniqueToastId}
            className="w-2/3 flex-row justify-between gap-6 p-4 shadow-hard-5">
            <HStack space="md" className="flex-row items-center gap-2">
              <Icon
                as={getIcon(action)}
                width={24}
                size="xl"
                height={24}
                className={getColor(action)}
              />
              <VStack space="xs">
                <ToastTitle className="font-semibold">{title}</ToastTitle>
                <ToastDescription size="sm" className="text-gray-500">
                  {description}
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
