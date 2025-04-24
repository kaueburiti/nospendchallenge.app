import { usePostHog } from 'posthog-react-native';
import { useCallback } from 'react';
import { useSession } from '@/hooks/useSession';

/**
 * Hook to capture events using PostHog
 * Automatically includes the user ID from the session
 * @returns {(event: string, properties?: Record<string, unknown>) => void}
 */
export const useCaptureEvent = () => {
  const posthog = usePostHog();
  const { session } = useSession();
  const userId = session?.user?.id;

  const captureEvent = useCallback(
    (event: string, properties?: Record<string, unknown>) => {
      const eventProperties = {
        ...(properties ?? {}),
        // Only add userId if it exists and isn't already in properties
        ...(userId && !properties?.userId ? { userId } : {}),
      };

      posthog?.capture(event, eventProperties);
    },
    [posthog, userId],
  );

  return { captureEvent };
};
