import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '../useSimpleToast';
import { type AuthError } from '@supabase/auth-js';

type SignInWithOtpParams = {
  email: string;
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
};

export const useSignInWithOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();

  const signInWithOtp = async ({
    email,
    onSuccess,
    onError,
  }: SignInWithOtpParams) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase(),
    });

    if (error) {
      console.error('OTP request error:', error);
      showToast(
        'error',
        'Oops, something went wrong',
        'Unable to send verification code. Please try again.',
      );
      onError?.(error);
    } else {
      showToast(
        'success',
        'Verification code sent!',
        'Please check your email for the code',
      );
      onSuccess?.();
    }

    setIsLoading(false);
  };

  return { isLoading, signInWithOtp };
};
