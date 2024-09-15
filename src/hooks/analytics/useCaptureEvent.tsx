import { usePostHog } from 'posthog-react-native';
import { useCallback } from 'react';


/**
 * Hook to capture events using PostHog
 * read the docs: https://docs.native.express/analytics/overview
 * @returns {(event: string, properties?: Record<string, unknown>) => void}
 */
export const useCaptureEvent = () => {
  const posthog = usePostHog();

  const captureEvent = useCallback(
    (
      event: string,
      properties?: Record<string, unknown>,
    ) => {
      posthog?.capture(event, properties);
    },
    [posthog],
  );

  return { captureEvent };
};
