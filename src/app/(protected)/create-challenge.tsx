import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Button, Text } from '@/components/ui';
import FormInput from '@/components/auth/FormInput';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { i18n } from '@/i18n';
import { useCreateChallenge } from '@/hooks/challenges';
import { useSession } from '@/hooks/useSession';

interface ChallengeForm {
  name: string;
  days: number;
}

export default function CreateChallenge() {
  const { user } = useSession();

  const { mutate: createChallenge } = useCreateChallenge();
  const { control, handleSubmit } = useForm<ChallengeForm>({
    defaultValues: {
      name: '',
      days: 0,
    },
  });

  const onSubmit = async (data: ChallengeForm) => {
    const startDay = new Date();
    const endDay = new Date(
      startDay.getTime() + data.days * 24 * 60 * 60 * 1000,
    );

    if (!user) {
      console.error('User not found');
      return;
    }

    createChallenge({
      title: data.name,
      start_date: startDay.toISOString(),
      end_date: endDay.toISOString(),
      owner_id: user.id,
      total_days: data.days,
    });
  };

  return (
    <SafeAreaView>
      <Box className="p-4">
        <Button onPress={() => router.back()}>
          <Text>Back</Text>
        </Button>
        <Text className="mb-6 text-2xl font-bold">
          {i18n.t('challenge.create_title')}
        </Text>

        <FormInput name="name" control={control} placeholder="Name" />
        <FormInput name="days" control={control} placeholder="Number of days" />
        <Button onPress={handleSubmit(onSubmit)}>
          <Text>{i18n.t('challenge.create_button')}</Text>
        </Button>
      </Box>
    </SafeAreaView>
  );
}
