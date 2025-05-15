import { router } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import EmptyList from '@/components/ui/list/empty';
import brokenPhoneAnimation from '@/assets/animations/broken-piggy.json';

const ChallengesEmptyState = () => {
  const { t } = useTranslation();

  return (
    <EmptyList
      title={t('home.no_challenges')}
      description={t('home.no_challenges_description')}
      buttonText={t('home.create_challenge')}
      onClick={() => router.push('/(protected)/challenges/create')}
      animation={{
        source: brokenPhoneAnimation,
        height: 162,
        width: 192,
      }}
    />
  );
};

export default ChallengesEmptyState;
