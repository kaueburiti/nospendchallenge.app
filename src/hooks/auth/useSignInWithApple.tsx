import { useState } from 'react';
import { useSimpleToast } from '../useSimpleToast';
import { supabase } from '@/lib/supabase';
import { type AuthError } from '@supabase/auth-js';
import * as AppleAuthentication from 'expo-apple-authentication';

type SignInWithAppleParams = {
  onSuccess?: () => void;
  onError?: (error: Error | AuthError) => void;
};

export const useSignInWithApple = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();

  const signInWithApple = async ({
    onSuccess,
    onError,
  }: SignInWithAppleParams = {}) => {
    setIsLoading(true);

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    }).catch(error => {
      console.error('Apple Authentication Error:', error);
      showToast('error', 'Apple Sign-In failed');
      onError?.(error as Error | AuthError);
      return null;
    });

    if (!credential?.identityToken) {
      showToast('error', 'Apple Sign-In failed: No identity token');
      onError?.(new Error('No identity token'));
      setIsLoading(false);
      return;
    }

    const {
      error,
      data: { user },
    } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });

    if (error) {
      console.error('Supabase Sign-In Error:', error);
      showToast('error', 'Sign-In failed');
      onError?.(error);
    } else {
      onSuccess?.();
    }

    setIsLoading(false);
  };

  return { isLoading, signInWithApple };
};
