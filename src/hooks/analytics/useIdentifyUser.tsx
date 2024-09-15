import { usePostHog } from 'posthog-react-native';
import { useCallback } from 'react';

/**
 * Hook to identify users using PostHog
 * read the docs: https://docs.native.express/analytics/overview
 * @returns {(distinctId: string, properties?: Record<string, unknown>, setOnceProperties?: Record<string, unknown>) => void}
 */
export const useIdentifyUser = () => {
  const posthog = usePostHog();

  const identifyUser = useCallback(
    (
      distinctId: string,
      properties?: Record<string, unknown>,
      setOnceProperties?: Record<string, unknown>,
    ) => {
      posthog?.identify(distinctId, properties, setOnceProperties);
    },
    [posthog],
  );

  return { identifyUser };
};
