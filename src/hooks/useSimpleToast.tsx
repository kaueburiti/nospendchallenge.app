import {
  Pressable,
  HStack,
  ToastDescription,
  Toast,
  ToastTitle,
  useToast,
  VStack,
} from '@/components/ui';
import { CloseIcon } from '@/components/ui/icon';
import { Icon } from '@/components/ui/icon';
import { getColor, getIcon } from './notifications';

export const useSimpleToast = () => {
  const toast = useToast();

  const showToast = (
    action: 'success' | 'error',
    title: string,
    description?: string,
  ) => {
    toast.show({
      placement: 'top',
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
                {description && (
                  <ToastDescription size="sm" className="text-gray-500">
                    {description}
                  </ToastDescription>
                )}
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

  return { showToast };
};
