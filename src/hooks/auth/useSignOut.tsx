import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '../useSimpleToast';
import type { AuthError } from '@supabase/auth-js';
import { useTranslation } from '@/hooks/useTranslation';

type SignOutParams = {
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
};

export const useSignOut = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();

  const signOut = async ({ onSuccess, onError }: SignOutParams) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Sign up error:', error);
      showToast('error', t('toast.account.sign_out_error'));
      onError?.(error);
    } else {
      onSuccess?.();
    }

    setIsLoading(false);
  };

  return { isLoading, signOut };
};
