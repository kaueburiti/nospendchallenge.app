import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '../useSimpleToast';
import type { AuthError } from '@supabase/auth-js';
import { type User } from '@supabase/supabase-js';

type UserProfileParams = {
  data: Partial<User['user_metadata']>;
  onSuccess?: () => void;
  onError?: (error: AuthError) => void;
};

export const useUpdateUserProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useSimpleToast();

  const updateUserProfile = async ({
    data,
    onSuccess,
    onError,
  }: UserProfileParams) => {
    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      data,
    });

    if (error) {
      console.error('Error updating user profile:', error);
      showToast('error', 'Failed to update the user profile');
      onError?.(error);
    } else {
      showToast('success', 'Profile updated successfully');
      onSuccess?.();
    }

    setIsLoading(false);
  };

  return { isLoading, updateUserProfile };
};
