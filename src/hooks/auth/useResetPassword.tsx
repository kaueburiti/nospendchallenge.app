import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '../useSimpleToast';
import type { AuthError } from '@supabase/auth-js';
import * as Linking from 'expo-linking';

type ResetPasswordParams = {
  email: string;
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
};

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();

  const resetPassword = async ({
    email,
    onSuccess,
    onError,
  }: ResetPasswordParams) => {
    setIsLoading(true);

    const redirectTo = Linking.createURL('/(protected)/update-password');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error('Reset password error:', error);
      showToast('error', 'Failed to send reset password instructions');
      onError?.(error);
    } else {
      showToast('success', 'Password reset instructions sent to your email');
      onSuccess?.();
    }

    setIsLoading(false);
  };

  return { isLoading, resetPassword };
};
