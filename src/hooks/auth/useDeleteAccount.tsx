import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '../useSimpleToast';
import type { AuthError } from '@supabase/auth-js';

type DeleteAccountParams = {
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
};

export const useDeleteAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();

  const deleteAccount = async ({ onSuccess, onError }: DeleteAccountParams) => {
    setIsLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // if the user is not logged in, the user.id will be null and the deleteUser function will return an error
    const { error } = await supabase.auth.admin.deleteUser(user?.id ?? '');

    if (error) {
      console.error('Delete account error:', error);
      showToast('error', 'Failed to delete account');
      onError?.(error);
    } else {
      showToast('success', 'Account deleted successfully');
      onSuccess?.();
    }

    setIsLoading(false);
  };

  return { isLoading, deleteAccount };
};
