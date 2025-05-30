import { AppState } from 'react-native';
import { type Session } from '@supabase/supabase-js';
import {
  SplashScreen,
  useRootNavigationState,
  useRouter,
  useSegments,
} from 'expo-router';
import React, {
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
  useContext,
} from 'react';
import { supabase } from '@/lib/supabase';

void SplashScreen.preventAutoHideAsync();

interface SessionContextProps {
  session: Session | null;
  isLoading: boolean;
}

export const SessionContext = createContext<SessionContextProps>({
  session: null,
  isLoading: true,
});

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const rootNavigationState = useRootNavigationState() as { key: string };

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoading && rootNavigationState.key) {
      const inProtectedGroup = segments[0] === '(protected)';
      const inPublicGroup = segments[0] === '(public)';
      const isPrivacyPolicy = segments[0] === 'privacy-policy';

      if (session && !inProtectedGroup && !isPrivacyPolicy) {
        router.replace('/(protected)/(tabs)/home');
      } else if (!session && !inPublicGroup && !isPrivacyPolicy) {
        router.replace('/(public)/welcome');
      }
    }
  }, [isLoading, session, segments, rootNavigationState.key]);

  useEffect(() => {
    void supabase.auth.startAutoRefresh();

    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        void supabase.auth.startAutoRefresh();
      } else if (state === 'background' || state === 'inactive') {
        void supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      subscription.remove();
      void supabase.auth.stopAutoRefresh();
    };
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};
