import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { useForm } from 'react-hook-form';
import { useCreateChallenge } from '@/hooks/challenges';
import { useSession } from '@/hooks/useSession';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChallengeForm } from '@/components/home/challenges/form/challenge-form';
import { useRouter } from 'expo-router';
import {
  challengeSchema,
  type ChallengeSchemaType,
} from '@/lib/schema/challenge';

export default function CreateChallenge() {
  const { session } = useSession();
  const { mutate: createChallenge, isPending } = useCreateChallenge();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ChallengeSchemaType>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  const onSubmit = async (data: ChallengeSchemaType) => {
    try {
      createChallenge(
        {
          title: data?.title,
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
        setImageData={() => null}
      />
    </SafeAreaView>
  );
}
