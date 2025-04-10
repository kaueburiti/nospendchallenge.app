import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '../useSimpleToast';
import { type AuthError } from '@supabase/auth-js';
import { useSession } from '@/provider/SessionProvider';

type SignUpParams = {
  email: string;
  password: string;
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
};

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();
  const { session } = useSession();

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
      showToast('error', 'Ops, something went wrong', error.message);
      onError?.(error);
    } else {
      showToast('success', 'Account successfully created!');
      onSuccess?.();

      await supabase.functions.invoke('welcome', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: { email, verificationUrl: 'verify.nospendchallenge.app' },
      });
    }

    setIsLoading(false);
  };

  return { isLoading, signUp };
};
