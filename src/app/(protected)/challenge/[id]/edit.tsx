import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Text } from '@/components/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { ChallengeForm } from '@/components/home/challenges/form/challenge-form';
import { updateChallenge } from '@/lib/db/repository/challenge';
import { type ChallengeSchemaType } from '@/lib/schema/challenge';
import { useTranslation } from '@/hooks/useTranslation';
import { useChallenge, useDeleteChallenge } from '@/hooks/challenges';
import { useQueryClient } from '@tanstack/react-query';
import { useShowNotification } from '@/hooks/notifications';
import { useCaptureEvent } from '@/hooks/analytics/useCaptureEvent';
import BackButton from '@/components/navigation/back-button';

export default function EditChallenge() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);
  const { mutate: deleteChallenge } = useDeleteChallenge();
  const queryClient = useQueryClient();
  const { triggerToast } = useShowNotification();
  const { captureEvent } = useCaptureEvent();

  if (isLoading || !challenge) {
    return (
      <SafeAreaView>
        <Box className="p-4">
          <Text>Loading...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      t('challenge.delete.title'),
      t('challenge.delete.description'),
      [
        {
          text: t('challenge.delete.cancel_button'),
          style: 'cancel',
        },
        {
          text: t('challenge.delete.delete_button'),
          style: 'destructive',
          onPress: () => {
            deleteChallenge(Number(id), {
              onSuccess: () => {
                router.replace('/(protected)/(tabs)/home');
              },
            });
          },
        },
      ],
    );
  };

  const handleSubmit = async (data: ChallengeSchemaType) => {
    // Set start date to first hour of the day (00:00:00)
    const startDate = new Date(data.startDate);
    startDate.setHours(0, 0, 0, 0);

    // Set end date to last hour of the day (23:59:59)
    const endDate = new Date(data.endDate);
    endDate.setHours(23, 59, 59, 999);

    await updateChallenge({
      id: challenge.id,
      title: data.title,
      description: data.description,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      cover: data.cover ?? null,
      savings_goal:
        typeof data.savingsGoal === 'number' ? data.savingsGoal : null,
    })
      .then(() => {
        triggerToast({
          title: 'Success',
          description: 'Challenge updated successfully',
          action: 'success',
        });

        void queryClient
          .invalidateQueries({ queryKey: ['challenges'] })
          .then(() => {
            router.replace('/(protected)/(tabs)/home');
            captureEvent('CHALLENGE_UPDATED', {
              title: data.title,
              description: data.description,
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
            });
          });
      })
      .catch(error => {
        triggerToast({
          title: 'Error',
          description: 'Failed to update challenge, please try again',
          action: 'error',
        });
        console.error(error);
      });
  };

  return (
    <SafeAreaView>
      <Box className="p-4">
        <BackButton />
      </Box>
      <ChallengeForm
        title={t('challenge.edit.title')}
        subtitle={t('challenge.edit.description')}
        isStartDateDisabled={true}
        submitButtonText={t('challenge.form.update_button')}
        showDeleteButton={true}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        defaultValues={{
          title: challenge.title,
          description: challenge.description ?? '',
          startDate: challenge.start_date
            ? new Date(challenge.start_date)
            : new Date(),
          endDate: challenge.end_date
            ? new Date(challenge.end_date)
            : new Date(),
          cover: challenge.cover ?? undefined,
          savingsGoal: challenge.savings_goal ?? undefined,
        }}
      />
    </SafeAreaView>
  );
}
