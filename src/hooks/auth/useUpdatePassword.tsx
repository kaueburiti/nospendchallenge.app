import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '../useSimpleToast';
import type { AuthError } from '@supabase/auth-js';
import { useSignOut } from './useSignOut';
import { useTranslation } from '@/hooks/useTranslation';

type SignOutParams = {
  newPassword: string;
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
};

export const useUpdatePassword = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();
  const { signOut } = useSignOut();

  const updatePassword = async ({
    newPassword,
    onSuccess,
    onError,
  }: SignOutParams) => {
    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      console.error('Error updating password:', error);
      showToast('error', t('toast.password.update_error'));
      onError?.(error);
    } else {
      showToast('success', t('toast.password.update_success'));
      await signOut({});
      onSuccess?.();
    }

    setIsLoading(false);
  };

  return { isLoading, updatePassword };
};
