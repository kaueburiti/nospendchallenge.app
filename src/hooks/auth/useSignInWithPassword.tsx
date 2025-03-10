import { useState } from 'react';
import { useSimpleToast } from '../useSimpleToast';
import { supabase } from '@/lib/supabase';
import { type AuthError } from '@supabase/auth-js';

type SignInWithPasswordParams = {
  email: string;
  password: string;
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
};

export const useSignInWithPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();

  const signInWithPassword = async ({
    email,
    password,
    onSuccess,
    onError,
  }: SignInWithPasswordParams) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      showToast(
        'error',
        'Ops, something went wrong',
        'Invalid email or password, please try again.',
      );
      onError?.(error);
    } else {
      showToast('success', 'Welcome back!');
      onSuccess?.();
    }

    setIsLoading(false);
  };

  return { isLoading, signInWithPassword };
};
