import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '../useSimpleToast';
import { type AuthError } from '@supabase/auth-js';

type VerifyOtpParams = {
  email: string;
  token: string;
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
};

export const useVerifyOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();

  const verifyOtp = async ({
    email,
    token,
    onSuccess,
    onError,
  }: VerifyOtpParams) => {
    setIsLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email: email.toLowerCase(),
      token,
      type: 'email',
    });

    if (error) {
      console.error('OTP verification error:', error);
      showToast(
        'error',
        'Invalid verification code',
        'Please try again or request a new code',
      );
      onError?.(error);
    } else {
      showToast('success', 'Welcome!', 'You have successfully signed in');
      onSuccess?.();
    }

    setIsLoading(false);
  };

  return { isLoading, verifyOtp };
};
