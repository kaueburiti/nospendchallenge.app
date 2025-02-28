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
import {
  FieldErrors,
  useForm,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { router } from 'expo-router';
import { i18n } from '@/i18n';
import { useCreateChallenge } from '@/hooks/challenges';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabase';
import { Pressable, ScrollView } from 'react-native';
import { decode } from 'base64-arraybuffer';
import { BadgeText } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';
import { StartAndEndDates } from '@/components/home/challenges/form/start-and-end-date';
import PhotoUpload from '@/components/ui/photo-upload';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createChallengeSchema = z.object({
  name: z.string().min(4),
  description: z.string().min(10),
  startDate: z.date(),
  endDate: z.date(),
});

interface ChallengeForm {
  name: string;
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
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof createChallengeSchema>>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      name: '',
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
    console.log('SUBMIT', data);
    // let coverUrl = null;
    // if (imageData) {
    //   coverUrl = await uploadImage(imageData);
    // }

    // createChallenge({
    //   title: data.name,
    //   start_date: data.startDate.toISOString(),
    //   end_date: data.endDate.toISOString(),
    //   owner_id: user!.id,
    //   cover: coverUrl,
    //   description: data.description,
    // });
  };

  const onError = (
    errors: FieldErrors<z.infer<typeof createChallengeSchema>>,
  ) => {
    console.log(errors);
  };

  return (
    <SafeAreaView>
      <ScrollView className="h-[1px] flex-1">
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
              errorMessage={errors.name?.message}
            />

            <FormInput
              label="Description"
              name="description"
              control={control}
              placeholder="Describe your challenge"
              errorMessage={errors.description?.message}
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
              <DaysSuggestions watch={watch} setValue={setValue} />
            </Box>
          </VStack>

          <Box className="mt-12 flex-row justify-between gap-4">
            <Button
              onPress={() => router.back()}
              className="flex-1"
              variant="outline">
              <ButtonText>Cancel</ButtonText>
            </Button>

            <Button
              onPress={handleSubmit(onSubmit, onError)}
              className="flex-1">
              <ButtonText>{i18n.t('challenge.create_button')}</ButtonText>
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

function DaysSuggestions({
  watch,
  setValue,
}: {
  watch: UseFormWatch<z.infer<typeof createChallengeSchema>>;
  setValue: UseFormSetValue<z.infer<typeof createChallengeSchema>>;
}) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<number>(0);

  return (
    <Box>
      <Text className="mb-2 text-sm">Some suggestions:</Text>
      <Box className="flex-row gap-4">
        {[30, 60, 90, 120].map(period => (
          <Pressable
            key={period}
            onPress={() => {
              const startDate = watch('startDate');
              const endDate = new Date(startDate);
              endDate.setDate(startDate.getDate() + period);

              setSelectedPeriod(selectedPeriod);
              setValue('endDate', endDate);
            }}>
            <Badge
              size="md"
              variant="outline"
              className="rounded-lg"
              action={selectedPeriod === period ? 'primary' : 'muted'}>
              <BadgeText>{period} Days</BadgeText>
            </Badge>
          </Pressable>
        ))}
      </Box>
    </Box>
  );
}
