import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Button, Text, Image } from '@/components/ui';
import FormInput from '@/components/auth/FormInput';
import { useForm } from 'react-hook-form';
import { router, useLocalSearchParams } from 'expo-router';
import { i18n } from '@/i18n';
import {
  useChallenge,
  useUpdateChallenge,
  useDeleteChallenge,
} from '@/hooks/challenges';
import { useSession } from '@/hooks/useSession';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { Pressable, Alert } from 'react-native';
import { decode } from 'base64-arraybuffer';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import type { Tables } from '@/lib/db/database.types';
import { StartAndEndDates } from '@/components/home/challenges/form/start-and-end-date';

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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.base64) {
          const fileExt = file.uri.split('.').pop()?.toLowerCase() ?? 'png';
          setImageData({
            uri: file.uri,
            base64: file.base64,
            fileExtension: fileExt,
          });
        }
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Failed to select image. Please try again.');
    }
  };

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
        <Button onPress={() => router.back()}>
          <Text>Back</Text>
        </Button>
        <Text className="mb-6 text-2xl font-bold">
          {i18n.t('challenge.edit_title')}
        </Text>

        <Pressable onPress={pickImage} className="mb-4">
          <Box className="h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-200">
            {imageData ? (
              <Image
                source={{ uri: imageData.uri }}
                className="h-full w-full"
                alt="Challenge cover"
              />
            ) : challenge.cover ? (
              <Image
                source={{ uri: challenge.cover }}
                className="h-full w-full"
                alt="Challenge cover"
              />
            ) : (
              <Text>Tap to add cover image</Text>
            )}
          </Box>
        </Pressable>

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
              onChange: date => setValue('end_date', date),
            }}
          />
        </Box>

        <Box className="mt-8 flex-row justify-between gap-4">
          <Button
            onPress={handleDelete}
            action="negative"
            variant="outline"
            className="flex-1">
            <Text className="text-red-500">Delete Challenge</Text>
          </Button>
          <Button onPress={handleSubmit(onSubmit)} className="flex-1">
            <Text>{i18n.t('challenge.update_button')}</Text>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
