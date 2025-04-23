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
import { useTranslation } from '@/hooks/useTranslation';
import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view';
interface ImageData {
  uri: string;
  base64: string;
  fileExtension: string;
}

interface ChallengeFormProps {
  title: string;
  subtitle: string;
  submitButtonText: string;
  defaultValues?: ChallengeSchemaType;
  isStartDateDisabled?: boolean;
  showDeleteButton?: boolean;
  onSubmit: (data: ChallengeSchemaType) => void;
  onDelete?: () => void;
  onError?: (errors: FieldErrors<ChallengeSchemaType>) => void;
}

export function ChallengeForm({
  title,
  subtitle,
  defaultValues,
  isStartDateDisabled = false,
  showDeleteButton = false,
  submitButtonText,
  onError,
  onDelete,
  onSubmit,
}: ChallengeFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChallengeSchemaType>({
    resolver: zodResolver(challengeSchema),
    defaultValues: defaultValues ?? {
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });
  const { t } = useTranslation();
  const { upload } = useUploadImage();
  const { session } = useSession();
  const ownerId = session?.user?.id;
  const [imageData, setImageData] = useState<ImageData | null>(null);

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

    onSubmit({
      title: data?.title,
      description: data?.description,
      startDate: data?.startDate,
      endDate: data?.endDate,
      cover: cover ?? undefined,
    });
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
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
              label={t('challenge.form.title.label')}
              name="title"
              control={control}
              placeholder={t('challenge.form.title.placeholder')}
              errorMessage={errors?.title?.message}
            />

            <FormInput
              label={t('challenge.form.description.label')}
              name="description"
              control={control}
              placeholder={t('challenge.form.description.placeholder')}
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
              <ButtonText>{t('challenge.form.cancel_button')}</ButtonText>
            </Button>

            <Button
              onPress={handleSubmit(handleSubmitTwo, onError)}
              className="flex-1"
              disabled={isSubmitting}>
              <ButtonText>
                {isSubmitting
                  ? t('challenge.form.saving_button')
                  : submitButtonText}
              </ButtonText>
            </Button>
          </Box>

          {showDeleteButton && onDelete && (
            <Box className="mt-4">
              <Button onPress={onDelete} action="negative" variant="outline">
                <ButtonText>{t('challenge.form.delete_button')}</ButtonText>
              </Button>
            </Box>
          )}
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
