import { type Session, type User } from '@supabase/supabase-js';
import { SplashScreen, useRouter, useSegments } from 'expo-router';
import React, {
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from 'react';

import { supabase } from '@/lib/supabase';
import { signInWithOneSignal } from '@/lib/one-signal';
import { useIdentifyUser } from '@/hooks/analytics/useIdentifyUser';

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

  /**
   * Listens for changes in the session and updates the state accordingly
   */
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session ? session.user : null);
      setInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  /**
   * Handles the session and redirects the user to the appropriate route depending on their session status
   */
  useEffect(() => {
    if (!initialized) return;

    const inProtectedGroup = segments[0] === '(protected)';

    if (session && !inProtectedGroup) {
      void signInWithOneSignal(session.user.id, session.user.email);
      identifyPosthogUser(session.user.id, { email: session.user.email });
      router.replace('/(protected)/(tabs)/home');
    } else if (!session) {
      router.replace('/(public)/welcome');
    }

    /* HACK: Something must be rendered when determining the initial auth state... 
    instead of creating a loading screen, we use the SplashScreen and hide it after
    a small delay (500 ms)
    */
    setTimeout(() => {
      void SplashScreen.hideAsync();
    }, 500);
  }, [initialized, session]);

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
