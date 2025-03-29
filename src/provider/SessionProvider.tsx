import { AppState } from 'react-native';
import { type Session, type User } from '@supabase/supabase-js';
import { SplashScreen, useRouter, useSegments } from 'expo-router';
import React, {
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
  useContext,
} from 'react';
import { supabase } from '@/lib/supabase';
import { signInWithOneSignal } from '@/lib/one-signal';
import { useIdentifyUser } from '@/hooks/analytics/useIdentifyUser';
import { RevenueCatContext } from '@/provider/RevenueCatProvider';

void SplashScreen.preventAutoHideAsync();

type SessionContextProps = {
  user: User | null;
  session: Session | null;
  initialized?: boolean;
};

export const SessionContext = createContext<SessionContextProps>({
  user: null,
  session: null,
  initialized: false,
});

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const segments = useSegments();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const { identifyUser: identifyPosthogUser } = useIdentifyUser();
  const { identifyUser: identifyRevenueCatUser, logout: logoutRevenueCat } =
    useContext(RevenueCatContext);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session ? session.user : null);

      if (event === 'SIGNED_OUT') {
        await logoutRevenueCat?.();
      }

      setInitialized(true);
    });

    void supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session ? session.user : null);
      setInitialized(true);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inProtectedGroup = segments[0] === '(protected)';
    const inPublicGroup = segments[0] === '(public)';
    const isPrivacyPolicy = segments[0] === 'privacy-policy';

    if (session && !inProtectedGroup && !isPrivacyPolicy) {
      void (async () => {
        await Promise.all([
          signInWithOneSignal(session.user.id, session.user.email),
          identifyPosthogUser(session.user.id, { email: session.user.email }),
          identifyRevenueCatUser?.(session.user.id),
        ]);
        router.replace('/(protected)/(tabs)/home');
      })();
    } else if (!session && !inPublicGroup && !isPrivacyPolicy) {
      router.replace('/(public)/welcome');
    }
  }, [initialized, session, segments]);

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

  if (!initialized) {
    return null;
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        session,
        initialized,
      }}>
      {children}
    </SessionContext.Provider>
  );
};
