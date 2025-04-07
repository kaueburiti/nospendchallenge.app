import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@/hooks/useTranslation';
import { useCreateChallenge } from '@/hooks/challenges';
import { useSession } from '@/hooks/useSession';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChallengeForm,
  challengeSchema,
  type ChallengeFormData,
} from '@/components/home/challenges/form/challenge-form';
import { useRouter } from 'expo-router';

export default function CreateChallenge() {
  const { t } = useTranslation();
  const { session } = useSession();
  const { mutate: createChallenge, isPending } = useCreateChallenge();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      type: 'spending',
      amount: 0,
    },
  });

  const onSubmit = async (data: ChallengeFormData) => {
    try {
      createChallenge(
        {
          title: data?.name,
          description: data?.description,
          start_date: data?.startDate.toISOString(),
          end_date: data?.endDate.toISOString(),
          owner_id: session?.user?.id ?? '',
          cover: null,
        },
        {
          onSuccess: () => {
            router.push('/(protected)/(tabs)/home');
          },
        },
      );
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  return (
    <SafeAreaView>
      <ChallengeForm
        title="Create Challenge"
        subtitle="Create a new challenge"
        onSubmit={onSubmit}
        control={control}
        errors={errors}
        watch={watch}
        setValue={setValue}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        imageData={null}
        setImageData={() => {}}
      />
    </SafeAreaView>
  );
}
