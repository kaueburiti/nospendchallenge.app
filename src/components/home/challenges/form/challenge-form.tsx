import React from 'react';
import {
  Box,
  Button,
  Text,
  Heading,
  ButtonText,
  VStack,
} from '@/components/ui';
import FormInput from '@/components/ui/form/input';
import type {
  Control,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
  UseFormHandleSubmit,
} from 'react-hook-form';
import { router } from 'expo-router';
import { i18n } from '@/i18n';
import { ScrollView } from '@/components/ui/scroll-view';
import { StartAndEndDates } from '@/components/home/challenges/form/start-and-end-date';
import PhotoUpload from '@/components/ui/photo-upload';
import { z } from 'zod';
import { DaysSuggestions } from './days-suggestions';
import { ChallengeSchemaType } from '@/lib/schema/challenge';

interface ImageData {
  uri: string;
  base64: string;
  fileExtension: string;
}

interface ChallengeFormProps {
  title: string;
  subtitle: string;
  control: Control<ChallengeSchemaType>;
  watch: UseFormWatch<ChallengeSchemaType>;
  setValue: UseFormSetValue<ChallengeSchemaType>;
  handleSubmit: UseFormHandleSubmit<ChallengeSchemaType>;
  errors: FieldErrors<ChallengeSchemaType>;
  onSubmit: (data: ChallengeSchemaType) => Promise<void>;
  onError?: (errors: FieldErrors<ChallengeSchemaType>) => void;
  imageData: ImageData | null;
  setImageData: (data: ImageData | null) => void;
  existingImageUrl?: string;
  isStartDateDisabled?: boolean;
  submitButtonText?: string;
  showDeleteButton?: boolean;
  isSubmitting?: boolean;
  onDelete?: () => void;
}

export function ChallengeForm({
  title,
  subtitle,
  control,
  watch,
  setValue,
  handleSubmit,
  errors,
  onSubmit,
  onError,
  imageData,
  setImageData,
  existingImageUrl,
  isStartDateDisabled = false,
  submitButtonText = i18n.t('challenge.create_button'),
  showDeleteButton = false,
  onDelete,
  isSubmitting = false,
}: ChallengeFormProps) {
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
          <PhotoUpload
            onImageUpload={imageData => setImageData(imageData)}
            uri={imageData?.uri ?? existingImageUrl}
          />
        </Box>

        <VStack space="2xl">
          <FormInput
            label="Name"
            name="name"
            control={control}
            placeholder="#MyChallenge"
            errorMessage={errors?.name?.message}
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
            onPress={handleSubmit(onSubmit, onError)}
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
