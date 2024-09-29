import { useEffect, useState } from 'react';
import { useSimpleToast } from '../useSimpleToast';
import { supabase } from '@/lib/supabase';
import { type AuthError } from '@supabase/auth-js';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type SignInWithGoogleParams = {
  onSuccess?: () => void;
  onError?: (error: Error | AuthError) => void;
};

export const useSignInWithGoogle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID
    });
  }, []);

  const signInWithGoogle = async ({
    onSuccess,
    onError,
  }: SignInWithGoogleParams = {}) => {
    setIsLoading(true);

    const hasPlayServices = await GoogleSignin.hasPlayServices().catch(
      error => {
        console.error('PlayServices not available:', error);
        showToast('error', 'Google Sign-In is not available');
        onError?.(error as Error | AuthError);
        return false;
      },
    );

    if (!hasPlayServices) {
      setIsLoading(false);
      return;
    }

    const userInfo = await GoogleSignin.signIn().catch(error => {
      console.error('Google Sign-In Error:', error);
      showToast('error', 'Google Sign-In failed');
      onError?.(error as Error | AuthError);
      return null;
    });

    if (!userInfo?.idToken) {
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: userInfo.idToken,
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

  return { isLoading, signInWithGoogle };
};
