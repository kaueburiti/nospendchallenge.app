import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Button, Text, Image } from '@/components/ui';
import FormInput from '@/components/auth/FormInput';
import { useForm } from 'react-hook-form';
import { router, useLocalSearchParams } from 'expo-router';
import { i18n } from '@/i18n';
import { useChallenge, useUpdateChallenge } from '@/hooks/challenges';
import { useSession } from '@/hooks/useSession';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { Pressable, Alert } from 'react-native';
import { decode } from 'base64-arraybuffer';

interface ChallengeForm {
  title: string;
  description: string;
  total_days: number;
}

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
  const [imageData, setImageData] = React.useState<ImageData | null>(null);

  const { control, handleSubmit } = useForm<ChallengeForm>({
    defaultValues: {
      title: challenge?.title ?? '',
      description: challenge?.description ?? '',
      total_days: challenge?.total_days ?? 0,
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
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
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
        <FormInput
          name="total_days"
          control={control}
          placeholder="Number of days"
        />
        <Button onPress={handleSubmit(onSubmit)}>
          <Text>{i18n.t('challenge.update_button')}</Text>
        </Button>
      </Box>
    </SafeAreaView>
  );
}
