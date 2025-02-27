import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Button, Text, ButtonText, Heading } from '@/components/ui';
import FormInput from '@/components/ui/form/input';
import { useForm } from 'react-hook-form';
import { router, useLocalSearchParams } from 'expo-router';
import { i18n } from '@/i18n';
import {
  useChallenge,
  useUpdateChallenge,
  useDeleteChallenge,
} from '@/hooks/challenges';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';
import { decode } from 'base64-arraybuffer';
import { format } from 'date-fns';
import type { Tables } from '@/lib/db/database.types';
import { StartAndEndDates } from '@/components/home/challenges/form/start-and-end-date';
import PhotoUpload from '@/components/ui/photo-upload';

type ChallengeForm = Omit<
  Tables<'challenges'>,
  'id' | 'created_at' | 'updated_at'
>;

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

  const { control, handleSubmit, watch, setValue } = useForm<ChallengeForm>({
    defaultValues: {
      title: challenge?.title ?? '',
      description: challenge?.description ?? '',
      end_date: String(
        challenge?.end_date ? new Date(challenge.end_date) : new Date(),
      ),
    },
  });

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

  const onSubmit = async (data: ChallengeForm) => {
    let coverUrl = challenge.cover;
    if (imageData) {
      coverUrl = await uploadImage(imageData);
    }

    updateChallenge(
      {
        id: Number(id),
        ...data,
        cover: coverUrl,
        end_date: String(data.end_date),
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
      <Box className="p-4">
        <Box className="mb-6 items-center">
          <Heading size="2xl" className="mb-1">
            {i18n.t('challenge.edit_title')}
          </Heading>
          <Text className="text-md text-gray-500">
            Let&apos;s get you started with a new challenge.
          </Text>
        </Box>

        <PhotoUpload
          onImageUpload={imageData => setImageData(imageData)}
          uri={imageData?.uri ?? challenge.cover ?? undefined}
        />

        <FormInput name="title" control={control} placeholder="Title" />
        <FormInput
          name="description"
          control={control}
          placeholder="Description"
        />

        <Box className="mb-4">
          <Text className="mb-2">Start Date</Text>
          <Box className="rounded-lg border border-gray-300 p-3">
            <Text>{format(new Date(challenge.start_date), 'PP')}</Text>
          </Box>
        </Box>

        <Box className="mb-4">
          <StartAndEndDates
            start={{
              date: new Date(challenge.start_date),
              disabled: true,
            }}
            end={{
              date: new Date(watch('end_date')),
              disabled: true,
              onChange: date => setValue('end_date', date.toISOString()),
            }}
          />
        </Box>

        <Box className="mb-12 mt-8 flex-row justify-between gap-4">
          <Button
            onPress={() => router.back()}
            className="flex-1"
            variant="outline">
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button onPress={handleSubmit(onSubmit)} className="flex-1">
            <ButtonText>{i18n.t('challenge.update_button')}</ButtonText>
          </Button>
        </Box>

        <Button onPress={handleDelete} action="negative" variant="outline">
          <Text className="text-red-500">Delete Challenge</Text>
        </Button>
      </Box>
    </SafeAreaView>
  );
}
