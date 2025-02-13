import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Button, Text, Image } from '@/components/ui';
import FormInput from '@/components/auth/FormInput';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { i18n } from '@/i18n';
import { useCreateChallenge } from '@/hooks/challenges';
import { useSession } from '@/hooks/useSession';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { Pressable, Alert } from 'react-native';
import { decode } from 'base64-arraybuffer';

interface ChallengeForm {
  name: string;
  days: number;
}

interface ImageData {
  uri: string;
  base64: string;
  fileExtension: string;
}

export default function CreateChallenge() {
  const { user } = useSession();
  const [imageData, setImageData] = React.useState<ImageData | null>(null);
  const { mutate: createChallenge } = useCreateChallenge();
  const { control, handleSubmit } = useForm<ChallengeForm>({
    defaultValues: {
      name: '',
      days: 0,
    },
  });

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

      const { data, error: uploadError } = await supabase.storage
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
    const startDay = new Date();
    const endDay = new Date(
      startDay.getTime() + data.days * 24 * 60 * 60 * 1000,
    );

    if (!user) {
      console.error('User not found');
      return;
    }

    let coverUrl = null;
    if (imageData) {
      coverUrl = await uploadImage(imageData);
    }

    createChallenge({
      title: data.name,
      start_date: startDay.toISOString(),
      end_date: endDay.toISOString(),
      owner_id: user.id,
      total_days: data.days,
      cover: coverUrl,
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

        <Pressable onPress={pickImage} className="mb-4">
          <Box className="h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-200">
            {imageData ? (
              <Image
                source={{ uri: imageData.uri }}
                className="h-full w-full"
                alt="Challenge cover"
              />
            ) : (
              <Text>Tap to add cover image</Text>
            )}
          </Box>
        </Pressable>

        <FormInput name="name" control={control} placeholder="Name" />
        <FormInput name="days" control={control} placeholder="Number of days" />
        <Button onPress={handleSubmit(onSubmit)}>
          <Text>{i18n.t('challenge.create_button')}</Text>
        </Button>
      </Box>
    </SafeAreaView>
  );
}
