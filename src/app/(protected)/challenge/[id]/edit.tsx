import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Text } from '@/components/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useChallenge, useDeleteChallenge } from '@/hooks/challenges';
import { Alert } from 'react-native';
import { ChallengeForm } from '@/components/home/challenges/form/challenge-form';
import { updateChallenge } from '@/lib/db/repository/challenge';
import { type ChallengeSchemaType } from '@/lib/schema/challenge';

export default function EditChallenge() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);
  const { mutate: deleteChallenge } = useDeleteChallenge();

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
      'Delete Challenge',
      'Are you sure you want to delete this challenge? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
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
    await updateChallenge({
      id: challenge.id,
      title: data.title,
      description: data.description,
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
        title="Edit Challenge"
        subtitle="Update your challenge details."
        isStartDateDisabled={true}
        submitButtonText="Update Challenge"
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
        }}
      />
    </SafeAreaView>
  );
}
