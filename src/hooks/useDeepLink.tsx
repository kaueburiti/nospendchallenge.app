import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useSetSession } from './auth/useSetSession';
import { parseSupabaseUrl } from '@/lib/supabase';

/**
 * Handles deep links from the app
 */
export const useDeepLink = () => {
  const { setSession } = useSetSession();

  useEffect(() => {
    const handleDeepLink = (event: Linking.EventType) => {
      const url = parseSupabaseUrl(event.url);
      const { path, queryParams } = Linking.parse(url);

      if (path === '(protected)/update-password') {
        const { access_token, refresh_token } = queryParams as {
          access_token?: string;
          refresh_token?: string;
        };
        if (
          typeof access_token === 'string' &&
          typeof refresh_token === 'string'
        ) {
          void setSession({
            access_token,
            refresh_token,
          });
        }
      }
      // Handle other deeplink paths as needed
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle initial deeplink
    void Linking.getInitialURL().then(url => {
      if (url) {
        void handleDeepLink({ url } as Linking.EventType);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
};
