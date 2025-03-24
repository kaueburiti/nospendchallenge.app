import { useToast as useNativeToast } from '@/components/ui';

interface ToastOptions {
  title: string;
  description?: string;
  status?: 'info' | 'warning' | 'success' | 'error';
  duration?: number;
}

/**
 * Hook for showing toast notifications
 */
export const useSimpleToast = () => {
  const nativeToast = useNativeToast();

  /**
   * Show a toast notification
   */
  const show = (options: ToastOptions) => {
    nativeToast.show({
      ...options,
      duration: options.duration ?? 3000,
    });
  };

  return {
    show,
  };
};
