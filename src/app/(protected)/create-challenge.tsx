import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { ChallengeForm } from '@/components/home/challenges/form/challenge-form';
import { useRouter } from 'expo-router';
import { type ChallengeSchemaType } from '@/lib/schema/challenge';
import { createChallenge } from '@/lib/db/repository/challenge';
import { useSession } from '@/hooks/useSession';
import { useTranslation } from '@/hooks/useTranslation';
export default function CreateChallenge() {
  const router = useRouter();
  const { t } = useTranslation();
  const { session } = useSession();
  const ownerId = session?.user?.id!;

  const handleSubmit = async (data: ChallengeSchemaType) => {
    await createChallenge({
      title: data.title,
      description: data.description,
      owner_id: ownerId,
      start_date: data.startDate.toISOString(),
      end_date: data.endDate.toISOString(),
      cover: data.cover ?? null,
    })
      .then(() => {
        router.replace('/(protected)/(tabs)/home');
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
