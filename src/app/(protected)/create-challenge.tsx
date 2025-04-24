import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { ChallengeForm } from '@/components/home/challenges/form/challenge-form';
import { useRouter } from 'expo-router';
import { type ChallengeSchemaType } from '@/lib/schema/challenge';
import { createChallenge } from '@/lib/db/repository/challenge';
import { useSession } from '@/hooks/useSession';
import { useTranslation } from '@/hooks/useTranslation';
import { usePostHog } from 'posthog-react-native';
export default function CreateChallenge() {
  const router = useRouter();
  const { t } = useTranslation();
  const { session } = useSession();
  const ownerId = session?.user?.id ?? '';
  const posthog = usePostHog();

  const handleSubmit = async (data: ChallengeSchemaType) => {
    // Set start date to first hour of the day (00:00:00)
    const startDate = new Date(data.startDate);
    startDate.setHours(0, 0, 0, 0);

    // Set end date to last hour of the day (23:59:59)
    const endDate = new Date(data.endDate);
    endDate.setHours(23, 59, 59, 999);

    await createChallenge({
      title: data.title,
      description: data.description,
      owner_id: ownerId,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      cover: data.cover ?? null,
      token: null, // Add token property as required by the type
    })
      .then(() => {
        router.replace('/(protected)/(tabs)/home');
        posthog.capture('Challenge Created', {
          title: data.title,
          description: data.description,
          owner_id: ownerId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <SafeAreaView>
      <ChallengeForm
        title={t('challenge.create.title')}
        subtitle={t('challenge.create.description')}
        submitButtonText={t('challenge.form.create_button')}
        onSubmit={handleSubmit}
        onError={errors => {
          console.log(errors);
        }}
      />
    </SafeAreaView>
  );
}
