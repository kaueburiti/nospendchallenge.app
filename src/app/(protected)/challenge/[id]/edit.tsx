import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Text } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { router, useLocalSearchParams } from 'expo-router';
import {
  useChallenge,
  useUpdateChallenge,
  useDeleteChallenge,
} from '@/hooks/challenges';
import { Alert } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChallengeForm } from '@/components/home/challenges/form/challenge-form';
import useUploadImage from '@/hooks/storage';
import { type ChallengeSchemaType } from '@/lib/schema/challenge';
import { challengeSchema } from '@/lib/schema/challenge';

export default function EditChallenge() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);
  const { mutate: deleteChallenge } = useDeleteChallenge();

  const { reset } = useForm<ChallengeSchemaType>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  // Reset form when challenge data is loaded
  React.useEffect(() => {
    if (challenge) {
      reset({
        title: challenge.title,
        description: challenge.description ?? '',
        startDate: challenge.start_date
          ? new Date(challenge.start_date)
          : new Date(),
        endDate: challenge.end_date ? new Date(challenge.end_date) : new Date(),
      });
    }
  }, [challenge, reset]);

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

  return (
    <SafeAreaView>
      <ChallengeForm
        title="Edit Challenge"
        subtitle="Update your challenge details."
        isStartDateDisabled={true}
        submitButtonText="Update Challenge"
        showDeleteButton={true}
        onDelete={handleDelete}
        onSuccess={() => {
          router.replace('/(protected)/(tabs)/home');
        }}
        onError={errors => {
          console.log(errors);
        }}
      />
    </SafeAreaView>
  );
}
