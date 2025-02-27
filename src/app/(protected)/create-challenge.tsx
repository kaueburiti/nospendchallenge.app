import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import {
  Box,
  Button,
  Text,
  Heading,
  ButtonText,
  VStack,
} from '@/components/ui';
import FormInput from '@/components/ui/form/input';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { i18n } from '@/i18n';
import { useCreateChallenge } from '@/hooks/challenges';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabase';
import { Pressable } from 'react-native';
import { decode } from 'base64-arraybuffer';
import { BadgeText } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import { StartAndEndDates } from '@/components/home/challenges/form/start-and-end-date';
import PhotoUpload from '@/components/ui/photo-upload';

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
      cover: coverUrl,
      description: data.description,
    });
  };

  return (
    <SafeAreaView>
      <Box className="px-4 py-12">
        <Box className="mb-8 items-center">
          <Heading size="2xl" className="mb-1">
            {i18n.t('challenge.create_title')}
          </Heading>
          <Text className="text-md text-gray-500">
            Let&apos;s get you started with a new challenge.
          </Text>
        </Box>

        <Box className="mb-6">
          <PhotoUpload
            onImageUpload={imageData => setImageData(imageData)}
            uri={imageData?.uri}
          />
        </Box>

        <VStack space="2xl">
          <FormInput
            label="Name"
            name="name"
            control={control}
            placeholder="#MyChallenge"
          />

          <FormInput
            label="Description"
            name="description"
            control={control}
            placeholder="Describe your challenge"
          />

          <Box className="flex-col gap-2">
            <StartAndEndDates
              start={{
                date: watch('startDate'),
                onChange: date => setValue('startDate', date),
              }}
              end={{
                date: watch('endDate'),
                onChange: date => setValue('endDate', date),
              }}
            />
            <Box>
              <Text className="mb-2 text-sm">Some suggestions:</Text>
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
                      className="rounded-lg"
                      action={watch('days') === days ? 'primary' : 'muted'}>
                      <BadgeText>{days} Days</BadgeText>
                    </Badge>
                  </Pressable>
                ))}
              </Box>
            </Box>
          </Box>
        </VStack>

        <Box className="mt-12 flex-row justify-between gap-4">
          <Button
            onPress={() => router.back()}
            className="flex-1"
            variant="outline">
            <ButtonText>Cancel</ButtonText>
          </Button>

          <Button onPress={handleSubmit(onSubmit)} className="flex-1">
            <ButtonText>{i18n.t('challenge.create_button')}</ButtonText>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
