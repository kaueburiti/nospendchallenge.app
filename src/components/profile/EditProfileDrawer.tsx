import React, { useEffect } from 'react';
import { Button, ButtonText } from '../ui/button';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { BottomDrawer } from '../BottomDrawer';
import PhotoUpload from '../ui/photo-upload';
import {
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
} from '@/hooks/useProfile';
import FormInput from '../ui/form/input';
import { Box } from '../ui/box';
import { useSimpleToast } from '@/hooks/useSimpleToast';
import { useTranslation } from '@/hooks/useTranslation';
import { profileSchema, type ProfileSchemaType } from '@/lib/schema/profile';
import { KeyboardAvoidingView } from '../ui/keyboard-avoiding-view';

interface ImageData {
  uri: string;
  base64: string;
  fileExtension: string;
}

export const EditProfileDrawer = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: Partial<SupabaseUser> | null;
}) => {
  const { t } = useTranslation();
  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const { showToast } = useSimpleToast();
  const [newImageData, setNewImageData] = React.useState<ImageData | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
    },
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name ?? '',
        last_name: profile.last_name ?? '',
        email: user?.email ?? '',
      });
    }
  }, [profile, reset, user]);

  const isLoading = isProfileLoading || isUpdating || isUploading;

  const onSubmit = async (data: ProfileSchemaType) => {
    try {
      const profileData = {
        first_name: data.first_name ?? '',
        last_name: data.last_name ?? '',
        display_name: `${data.first_name} ${data.last_name}`.trim(),
      };

      // Handle image upload if there's a new image
      if (newImageData) {
        uploadAvatar({
          base64: newImageData.base64,
          fileExtension: newImageData.fileExtension,
        });
      }

      // Update profile data
      updateProfile(profileData, {
        onSuccess: async () => {
          onClose();
          showToast('success', 'Profile updated successfully');
        },
        onError: error => {
          console.error('Error updating profile:', error);
          showToast('error', 'Error saving profile', 'Please, try again later');
        },
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('error', 'Error saving profile', 'Please, try again later');
    }
  };

  const avatar = newImageData?.uri ?? profile?.avatar_url ?? '';

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={t('profile.edit_profile.title')}>
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <VStack space="4xl" className="mb-2 w-full p-4">
          <PhotoUpload
            onImageUpload={imageData => setNewImageData(imageData)}
            fallbackText={`${profile?.first_name} ${profile?.last_name}`}
            uri={avatar}
          />

          <VStack space="md">
            <HStack space="md">
              <Box className="flex-1">
                <FormInput
                  name="first_name"
                  placeholder={t('profile.form.first_name.placeholder')}
                  label={t('profile.form.first_name.label')}
                  control={control}
                  errorMessage={errors.first_name?.message}
                />
              </Box>
              <Box className="flex-1">
                <FormInput
                  name="last_name"
                  placeholder={t('profile.form.last_name.placeholder')}
                  label={t('profile.form.last_name.label')}
                  control={control}
                  errorMessage={errors.last_name?.message}
                />
              </Box>
            </HStack>

            <FormInput
              name="email"
              placeholder={t('profile.form.email.placeholder')}
              label={t('profile.form.email.label')}
              control={control}
              disabled={true}
              errorMessage={errors.email?.message}
            />
          </VStack>
        </VStack>

        <HStack space="md" className="justify-end">
          <Button variant="outline" onPress={onClose}>
            <ButtonText>{t('profile.form.cancel_button')}</ButtonText>
          </Button>
          <Button onPress={handleSubmit(onSubmit)} isDisabled={isLoading}>
            <ButtonText>
              {isLoading
                ? t('profile.form.saving_button')
                : t('profile.form.save_button')}
            </ButtonText>
          </Button>
        </HStack>
      </KeyboardAvoidingView>
    </BottomDrawer>
  );
};
