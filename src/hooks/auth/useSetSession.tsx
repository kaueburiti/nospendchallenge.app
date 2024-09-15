import { useState } from 'react';
import { useSimpleToast } from '../useSimpleToast';
import { supabase } from '@/lib/supabase';
import { type AuthError } from '@supabase/auth-js';

type SetSessionParams = {
  access_token: string;
  refresh_token: string;
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
};

export const useSetSession = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();

  const setSession = async ({
    access_token,
    refresh_token,
    onSuccess,
    onError,
  }: SetSessionParams) => {
    setIsLoading(true);

    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      console.error('Set session error:', error);
      showToast('error', 'Failed to set session');
      onError?.(error);
    } else {
      showToast('success', 'Session set successfully');
      onSuccess?.();
    }

    setIsLoading(false);
  };

  return { isLoading, setSession };
};
