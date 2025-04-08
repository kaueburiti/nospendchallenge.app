import ListEmptyState from '@/components/ui/list/empty';
import { router } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';

const ChallengesEmptyState = () => {
  const { t } = useTranslation();

  return (
    <ListEmptyState
      title={t('home.no_challenges')}
      description={t('home.no_challenges_description')}
      ctaText={t('home.create_challenge')}
      onCtaClick={() => router.push('/(protected)/create-challenge')}
    />
  );
};

export default ChallengesEmptyState;
