import ListEmptyState from '@/components/ui/list/empty';
import { router } from 'expo-router';

const ChallengesEmptyState = () => {
  return (
    <ListEmptyState
      title="No challenges yet"
      description="Create your first challenge to get started!"
      ctaText="Start a Challenge"
      onCtaClick={() => router.push('/(protected)/create-challenge')}
    />
  );
};

export default ChallengesEmptyState;
