import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Button, Text, Image, Heading } from '@/components/ui';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { BadgeText } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';

interface ChallengeForm {
  name: string;
  days: number;
  description: string;
  startDate: Date;
  endDate: Date;
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
  const { control, handleSubmit, watch, setValue } = useForm<ChallengeForm>({
    defaultValues: {
      name: '',
      days: 0,
      description: '',
      startDate: new Date(),
      endDate: new Date(),
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
    let coverUrl = null;
    if (imageData) {
      coverUrl = await uploadImage(imageData);
    }

    createChallenge({
      title: data.name,
      start_date: data.startDate.toISOString(),
      end_date: data.endDate.toISOString(),
      owner_id: user!.id,
      total_days: data.days,
      cover: coverUrl,
      description: data.description,
    });
  };

  return (
    <SafeAreaView>
      <Box className="p-4">
        <Button onPress={() => router.back()} className="mb-4">
          <Text>Back</Text>
        </Button>

        <Box className="mb-6 items-center">
          <Heading size="2xl" className="mb-1">
            {i18n.t('challenge.create_title')}
          </Heading>
          <Text className="text-md text-gray-500">
            Let's get you started with a new challenge.
          </Text>
        </Box>

        <>
          <Pressable onPress={pickImage} className="mb-4 items-center">
            <Box className="h-64 w-64 items-center justify-center overflow-hidden rounded-full border-[12px] border-gray-300 bg-gray-200">
              {imageData ? (
                <Image
                  source={{ uri: imageData.uri }}
                  className="h-full w-full"
                  alt="Challenge cover"
                />
              ) : (
                <Text className="text-center text-xs">
                  Tap to add cover image
                </Text>
              )}
            </Box>
          </Pressable>

          <Box className="my-4 flex w-full flex-col gap-4">
            <FormInput
              name="name"
              control={control}
              placeholder="#MyChallenge"
            />

            <FormInput
              name="description"
              control={control}
              placeholder="Describe your challenge"
            />
          </Box>

          <Box>
            <Box className="flex-row justify-between gap-4">
              <Box className="mb-4">
                <Text className="mb-2">Start Date</Text>
                <Box className="-ml-3">
                  <DateTimePicker
                    value={watch('startDate')}
                    mode="date"
                    onChange={(_, date) => {
                      // if (date)
                      // control._fieldsRef.current.startDate?._f.onChange(date);
                    }}
                  />
                </Box>
              </Box>
              <Box className="mb-4">
                <Text className="mb-2">End Date</Text>
                <Box className="-ml-3">
                  <DateTimePicker
                    value={watch('endDate')}
                    mode="date"
                    onChange={(_, date) => {
                      // if (date)
                      // control._fieldsRef.current.endDate?._f.onChange(date);
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Box>
              <Text className="mb-2">Suggestions:</Text>
              <Box className="flex-row gap-4">
                {[30, 60, 90, 120].map(days => (
                  <Pressable
                    key={days}
                    onPress={() => {
                      const startDate = watch('startDate');
                      const endDate = new Date(startDate);
                      endDate.setDate(startDate.getDate() + days);

                      setValue('days', days);
                      setValue('endDate', endDate);
                    }}>
                    <Badge
                      size="md"
                      variant="outline"
                      action={watch('days') === days ? 'info' : 'muted'}>
                      <BadgeText>{days} Days</BadgeText>
                    </Badge>
                  </Pressable>
                ))}
              </Box>
            </Box>
          </Box>
        </>

        <Box className="mt-6 flex-row justify-between">
          <Button onPress={handleSubmit(onSubmit)} className="ml-auto w-full">
            <Text>{i18n.t('challenge.create_button')}</Text>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
