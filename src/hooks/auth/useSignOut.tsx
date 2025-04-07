import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '../useSimpleToast';
import type { AuthError } from '@supabase/auth-js';

type SignOutParams = {
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
};

export const useSignOut = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();

  const signOut = async ({ onSuccess, onError }: SignOutParams) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign up error:', error);
      showToast('error', 'Sign out failed');
      onError?.(error);
    } else {
      onSuccess?.();
    }

    setIsLoading(false);
  };

  return { isLoading, signOut };
};
