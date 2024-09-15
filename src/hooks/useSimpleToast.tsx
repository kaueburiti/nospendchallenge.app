import { Toast, ToastTitle, useToast } from '@/components/ui';

export const useSimpleToast = () => {
  const toast = useToast();

  const showToast = (action: 'success' | 'error', title: string) => {
    toast.show({
      placement: 'bottom',
      render: ({ id }) => (
        <Toast nativeID={id} variant="solid" action={action}>
          <ToastTitle>{title}</ToastTitle>
        </Toast>
      ),
    });
  };

  return { showToast };
};
