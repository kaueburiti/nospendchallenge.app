import { useFeatureFlag } from 'posthog-react-native';
import { type PropsWithChildren } from 'react';

export const usePaidFeaturesGatekeeper = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const showFlaggedFeature: boolean = useFeatureFlag('show-new-paid-features');

  return showFlaggedFeature;
};

export const PaidFeaturesGatekeeper = ({ children }: PropsWithChildren) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const showFlaggedFeature = usePaidFeaturesGatekeeper();

  if (!showFlaggedFeature) {
    return null;
  }

  return children;
};
