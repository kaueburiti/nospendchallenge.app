import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '../useSimpleToast';
import { type AuthError } from '@supabase/auth-js';
import { useSession } from '@/provider/SessionProvider';

type SignUpParams = {
  firstName: string;
  lastName: string;
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
    firstName,
    lastName,
    email,
    password,
    onSuccess,
    onError,
  }: SignUpParams) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          avatar_url: process.env.EXPO_PUBLIC_USER_PROFILE_URL,
        },
      },
    });

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
        body: {
          email,
          firstName,
          lastName,
          verificationUrl: 'verify.nospendchallenge.app',
        },
      });
    }

    setIsLoading(false);
  };

  return { isLoading, signUp };
};
