import ListEmptyState from '@/components/ui/list/empty';
import { router } from 'expo-router';

const RecentActivitiesEmptyState = () => {
  return (
    <ListEmptyState
      title="No activities yet"
      description="Create your first challenge to get started!"
      ctaText="Start a Challenge"
      onCtaClick={() => router.push('/(protected)/create-challenge')}
    />
  );
};

export default RecentActivitiesEmptyState;
