import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '../useSimpleToast';
import type { AuthError } from '@supabase/auth-js';
import { useSignOut } from './useSignOut';

type SignOutParams = {
  newPassword: string;
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
};

export const useUpdatePassword = () => {
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
      showToast('error', 'Failed to update the password');
      onError?.(error);
    } else {
      showToast('success', 'Password updated successfully');
      await signOut({});
      onSuccess?.();
    }

    setIsLoading(false);
  };

  return { isLoading, updatePassword };
};
