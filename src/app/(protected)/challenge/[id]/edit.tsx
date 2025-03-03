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
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';
import { decode } from 'base64-arraybuffer';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChallengeForm,
  challengeSchema,
  type ChallengeFormData,
} from '@/components/home/challenges/form/challenge-form';

interface ImageData {
  uri: string;
  base64: string;
  fileExtension: string;
}

export default function EditChallenge() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();
  const { data: challenge, isLoading } = useChallenge(id);
  const { mutate: updateChallenge } = useUpdateChallenge();
  const { mutate: deleteChallenge } = useDeleteChallenge();
  const [imageData, setImageData] = React.useState<ImageData | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  // Reset form when challenge data is loaded
  React.useEffect(() => {
    if (challenge) {
      reset({
        name: challenge.title,
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

  const uploadImage = async (imageData: ImageData) => {
    try {
      const fileName = `${Math.random()}.${imageData.fileExtension}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('challenges')
        .upload(filePath, decode(imageData.base64), {
          contentType: `image/${imageData.fileExtension}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('challenges')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const onSubmit = async (data: ChallengeFormData) => {
    let coverUrl = challenge.cover;
    if (imageData) {
      coverUrl = await uploadImage(imageData);
    }

    updateChallenge(
      {
        id: Number(id),
        title: data.name,
        description: data.description,
        cover: coverUrl,
        end_date: data.endDate.toISOString(),
        start_date: data.startDate.toISOString(),
      },
      {
        onSuccess: () => {
          router.back();
          console.log('Challenge updated');
        },
        onError: error => {
          console.error('Error updating challenge:', error);
        },
      },
    );
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
      />
    </SafeAreaView>
  );
}
