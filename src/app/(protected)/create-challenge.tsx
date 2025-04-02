import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { useForm } from 'react-hook-form';
import { useTranslation } from '@/hooks/useTranslation';
import { useCreateChallenge } from '@/hooks/challenges';
import { useSession } from '@/hooks/useSession';
import { zodResolver } from '@hookform/resolvers/zod';
import ChallengeForm from '@/components/home/challenges/form/challenge-form';
import {
  challengeSchema,
  type ChallengeSchemaType,
} from '@/lib/schema/challenge';
import { useRouter } from 'expo-router';

export default function CreateChallenge() {
  const { t } = useTranslation();
  const { session } = useSession();
  const { mutate: createChallenge, isPending } = useCreateChallenge();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChallengeSchemaType>({
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

  const onSubmit = async (data: ChallengeSchemaType) => {
    try {
      createChallenge(
        {
          title: data.name,
          description: data.description,
          start_date: data.startDate.toISOString(),
          end_date: data.endDate.toISOString(),
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
        onSubmit={onSubmit}
        isLoading={isPending}
        defaultValues={{
          name: '',
          description: '',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          type: 'spending',
          amount: 0,
        }}
      />
    </SafeAreaView>
  );
}
