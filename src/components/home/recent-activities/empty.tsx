import ListEmptyState from '@/components/ui/list/empty';
import { router } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';

const RecentActivitiesEmptyState = () => {
  const { t } = useTranslation();

  return (
    <ListEmptyState
      title={t('home.no_activities')}
      description={t('home.no_activities_description')}
      ctaText={t('home.create_challenge')}
      onCtaClick={() => router.push('/(protected)/challenges/create')}
    />
  );
};

export default RecentActivitiesEmptyState;
