import { useEffect, useState } from 'react';
import { useProfile } from './useProfile';
import { useSession } from './useSession';
import { router } from 'expo-router';

export const useProfileCompletion = () => {
  const { session } = useSession();
  const { data: profile, isLoading } = useProfile(session?.user?.id);
  const [isCheckComplete, setIsCheckComplete] = useState(false);

  useEffect(() => {
    if (isLoading || !session) return;

    // If profile exists but name fields are empty, redirect to complete profile
    if (profile && (!profile.first_name || !profile.last_name)) {
      router.replace('/(protected)/complete-profile');
    }

    setIsCheckComplete(true);
  }, [profile, isLoading, session]);

  return { isProfileComplete: isCheckComplete };
};
