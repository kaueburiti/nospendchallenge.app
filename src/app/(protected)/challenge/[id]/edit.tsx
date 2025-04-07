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

interface ImageData {
  uri: string;
  base64: string;
  fileExtension: string;
}

export default function EditChallenge() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { upload } = useUploadImage();
  const { data: challenge, isLoading } = useChallenge(id);
  const { mutate: updateChallenge } = useUpdateChallenge();
  const { mutate: deleteChallenge } = useDeleteChallenge();
  const [imageData, setImageData] = React.useState<ImageData | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChallengeSchemaType>({
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

  const onSubmit = async (data: ChallengeSchemaType) => {
    let coverUrl = challenge.cover;
    if (imageData) {
      coverUrl = await upload({
        bucket: 'challenges',
        name: `${data.title}-cover-${challenge.id}.${imageData.fileExtension}`,
        path: String(challenge.owner_id),
        image: imageData,
      });
    }

    updateChallenge({
      id: Number(id),
      title: data.title,
      description: data.description,
      cover: coverUrl,
      end_date: data.endDate.toISOString(),
      start_date: data.startDate.toISOString(),
    });
  };

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
        control={control}
        watch={watch}
        setValue={setValue}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
        imageData={imageData}
        setImageData={setImageData}
        existingImageUrl={challenge.cover ?? undefined}
        isStartDateDisabled={true}
        submitButtonText="Update Challenge"
        showDeleteButton={true}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
      />
    </SafeAreaView>
  );
}
