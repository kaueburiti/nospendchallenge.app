import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '../useSimpleToast';
import { type AuthError } from '@supabase/auth-js';

type SignUpParams = {
  email: string;
  password: string;
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
};

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();

  const signUp = async ({
    email,
    password,
    onSuccess,
    onError,
  }: SignUpParams) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error('Sign up error:', error);
      showToast('error', 'Sign up failed');
      onError?.(error);
    } else {
      showToast('success', 'Account created successfully');
      onSuccess?.();
    }

    setIsLoading(false);
  };

  return { isLoading, signUp };
};
