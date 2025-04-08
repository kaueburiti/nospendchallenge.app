import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Heading,
  ButtonText,
  VStack,
} from '@/components/ui';
import FormInput from '@/components/ui/form/input';
import type { FieldErrors } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { router } from 'expo-router';
import { i18n } from '@/i18n';
import { ScrollView } from '@/components/ui/scroll-view';
import { StartAndEndDates } from '@/components/home/challenges/form/start-and-end-date';
import PhotoUpload from '@/components/ui/photo-upload';
import { DaysSuggestions } from './days-suggestions';
import {
  challengeSchema,
  type ChallengeSchemaType,
} from '@/lib/schema/challenge';
import { zodResolver } from '@hookform/resolvers/zod';
import useUploadImage from '@/hooks/storage';
import { useSession } from '@/hooks/useSession';
import { useCreateChallenge } from '@/hooks/challenges';

interface ImageData {
  uri: string;
  base64: string;
  fileExtension: string;
}

interface ChallengeFormProps {
  title: string;
  subtitle: string;
  isStartDateDisabled?: boolean;
  submitButtonText?: string;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  onSuccess: () => void;
  onError: (errors: FieldErrors<ChallengeSchemaType>) => void;
}

export function ChallengeForm({
  title,
  subtitle,
  onError,
  isStartDateDisabled = false,
  submitButtonText = i18n.t('challenge.create_button'),
  showDeleteButton = false,
  onDelete,
  onSuccess,
}: ChallengeFormProps) {
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
  const { upload } = useUploadImage();
  const { session } = useSession();
  const ownerId = session?.user?.id;
  const [imageData, setImageData] = useState<ImageData | null>(null);

  const { mutate: createChallenge, isPending } = useCreateChallenge();

  const handleSubmitTwo = async (data: ChallengeSchemaType) => {
    let cover = data.cover;

    if (imageData) {
      cover =
        (await upload({
          bucket: 'challenges',
          name: `${data.title}-cover-${ownerId}.${imageData.fileExtension}`,
          path: String(ownerId),
          image: imageData,
        })) ?? undefined;
    }

    try {
      // CREATE OR UPDATE CHALLENGE
      createChallenge(
        {
          title: data?.title,
          description: data?.description,
          start_date: data?.startDate.toISOString(),
          end_date: data?.endDate.toISOString(),
          owner_id: ownerId ?? '',
          cover: cover ?? null,
        },
        {
          onSuccess: onSuccess,
        },
      );
    } catch (error) {
      onError(error as FieldErrors<ChallengeSchemaType>);
      console.error('Error creating challenge:', error);
    }
  };

  return (
    <ScrollView className="h-[1px] flex-1">
      <Box className="px-4 py-12">
        <Box className="mb-8 items-center">
          <Heading size="2xl" className="mb-1">
            {title}
          </Heading>
          <Text className="text-md text-gray-500">{subtitle}</Text>
        </Box>

        <Box className="mb-6">
          <PhotoUpload onImageUpload={setImageData} uri={imageData?.uri} />
        </Box>

        <VStack space="2xl">
          <FormInput
            label="Title"
            name="title"
            control={control}
            placeholder="#MyChallenge"
            errorMessage={errors?.title?.message}
          />

          <FormInput
            label="Description"
            name="description"
            control={control}
            placeholder="Describe your challenge"
            errorMessage={errors?.description?.message}
          />

          <Box className="flex-col gap-2">
            <StartAndEndDates
              start={{
                date: watch('startDate'),
                onChange: !isStartDateDisabled
                  ? date => setValue('startDate', date)
                  : undefined,
                disabled: isStartDateDisabled,
              }}
              end={{
                date: watch('endDate'),
                onChange: date => setValue('endDate', date),
              }}
            />
            {!isStartDateDisabled && (
              <DaysSuggestions watch={watch} setValue={setValue} />
            )}
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
            onPress={handleSubmit(handleSubmitTwo, onError)}
            className="flex-1"
            disabled={isSubmitting}>
            <ButtonText>
              {isSubmitting ? 'Sending...' : submitButtonText}
            </ButtonText>
          </Button>
        </Box>

        {showDeleteButton && onDelete && (
          <Box className="mt-4">
            <Button onPress={onDelete} action="negative" variant="outline">
              <ButtonText>Delete Challenge</ButtonText>
            </Button>
          </Box>
        )}
      </Box>
    </ScrollView>
  );
}
