import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { type FieldErrors, useForm } from 'react-hook-form';
import { i18n } from '@/i18n';
import { useCreateChallenge } from '@/hooks/challenges';
import { useSession } from '@/hooks/useSession';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChallengeForm,
  challengeSchema,
  type ChallengeFormData,
} from '@/components/home/challenges/form/challenge-form';
import useUploadImage from '@/hooks/storage';

interface ImageData {
  uri: string;
  base64: string;
  fileExtension: string;
}

export default function CreateChallenge() {
  const { user } = useSession();
  const { upload } = useUploadImage();
  const [imageData, setImageData] = React.useState<ImageData | null>(null);
  const { mutate: createChallenge } = useCreateChallenge();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });

  const onSubmit = async (data: ChallengeFormData) => {
    try {
      let coverUrl = null;

      if (imageData) {
        coverUrl = await upload({
          bucket: 'challenges',
          name: `${Math.random().toString()}-cover`,
          path: String(user?.id),
          image: imageData,
        });
      }

      createChallenge({
        title: data.name,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate.toISOString(),
        owner_id: user!.id,
        cover: coverUrl,
        description: data.description,
      });
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  const onError = (errors: FieldErrors<ChallengeFormData>) => {
    console.log(errors);
  };

  return (
    <SafeAreaView>
      <ChallengeForm
        title={i18n.t('challenge.create_title')}
        subtitle="Let's get you started with a new challenge."
        control={control}
        watch={watch}
        setValue={setValue}
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
        onError={onError}
        imageData={imageData}
        setImageData={setImageData}
        isSubmitting={isSubmitting}
      />
    </SafeAreaView>
  );
}
