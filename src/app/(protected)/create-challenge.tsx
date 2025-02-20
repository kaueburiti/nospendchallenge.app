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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Progress } from '@/components/ui/progress';
import { ProgressFilledTrack } from '@/components/ui/progress';

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
  const [step, setStep] = React.useState(1);
  const [imageData, setImageData] = React.useState<ImageData | null>(null);
  const { mutate: createChallenge } = useCreateChallenge();
  const { control, handleSubmit, watch } = useForm<ChallengeForm>({
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

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Text className="mb-4 text-lg">Step 1: Basic Information</Text>
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
            <FormInput
              name="name"
              control={control}
              placeholder="Challenge Name"
            />
          </>
        );
      case 2:
        return (
          <>
            <Text className="mb-4 text-lg">Step 2: Challenge Duration</Text>
            <Box className="mb-4">
              <Text className="mb-2">Start Date</Text>
              <DateTimePicker
                value={watch('startDate')}
                mode="date"
                onChange={(_, date) => {
                  // if (date)
                  // control._fieldsRef.current.startDate?._f.onChange(date);
                }}
              />
            </Box>
            <Box className="mb-4">
              <Text className="mb-2">End Date</Text>
              <DateTimePicker
                value={watch('endDate')}
                mode="date"
                onChange={(_, date) => {
                  // if (date)
                  // control._fieldsRef.current.endDate?._f.onChange(date);
                }}
              />
            </Box>
          </>
        );
      case 3:
        return (
          <>
            <Text className="mb-4 text-lg">Step 3: Challenge Description</Text>
            <FormInput
              name="description"
              control={control}
              placeholder="Describe your challenge"
              numberOfLines={4}
            />
          </>
        );
    }
  };

  return (
    <SafeAreaView>
      <Box className="p-4">
        <Button onPress={() => router.back()} className="mb-4">
          <Text>Back</Text>
        </Button>

        <Text className="mb-6 text-2xl font-bold">
          {i18n.t('challenge.create_title')}
        </Text>

        <Progress value={(step / 3) * 100} className="mb-6">
          <ProgressFilledTrack />
        </Progress>

        {renderStep()}

        <Box className="mt-6 flex-row justify-between">
          {step > 1 && (
            <Button onPress={prevStep} variant="outline">
              <Text>Previous</Text>
            </Button>
          )}

          {step < 3 ? (
            <Button onPress={nextStep} className="ml-auto">
              <Text>Next</Text>
            </Button>
          ) : (
            <Button onPress={handleSubmit(onSubmit)} className="ml-auto">
              <Text>{i18n.t('challenge.create_button')}</Text>
            </Button>
          )}
        </Box>
      </Box>
    </SafeAreaView>
  );
}
