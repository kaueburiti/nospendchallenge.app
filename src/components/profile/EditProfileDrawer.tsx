import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Button, ButtonText } from '../ui/button';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { Center, Input, InputField } from '../ui';
import * as ImagePicker from 'expo-image-picker';
import { z } from 'zod';
import { decode } from 'base64-arraybuffer';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { BottomDrawer } from '../BottomDrawer';
import { i18n } from '@/i18n';
import PhotoUpload from '../ui/photo-upload';
import FormInputLabel from '../ui/form/label';
import {
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
} from '@/hooks/useProfile';

const profileSchema = z.object({
  first_name: z
    .string()
    .min(2, i18n.t('profile.validation_name_min_length'))
    .optional(),
  last_name: z
    .string()
    .min(2, i18n.t('profile.validation_name_min_length'))
    .optional(),
  display_name: z
    .string()
    .min(2, i18n.t('profile.validation_name_min_length'))
    .optional(),
  avatar_url: z
    .string()
    .url(i18n.t('profile.validation_invalid_avatar_url'))
    .optional(),
});

interface ImageData {
  uri: string;
  base64: string;
  fileExtension: string;
}

export const EditProfileDrawer = ({
  isOpen,
  onClose,
  user,
  onSave,
  isLoading: externalLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: Partial<SupabaseUser> | null;
  onSave: () => Promise<void>;
  isLoading: boolean;
}) => {
  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newImageData, setNewImageData] = useState<ImageData | null>(null);
  const [validationError, setValidationError] = useState('');

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
    }
  }, [profile]);

  const isLoading =
    externalLoading || isProfileLoading || isUpdating || isUploading;

  const handleSave = async () => {
    setValidationError('');

    try {
      // Validate input data
      const profileData = {
        first_name: firstName,
        last_name: lastName,
        display_name: `${firstName} ${lastName}`.trim(),
      };

      profileSchema.parse(profileData);

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
          await onSave();
          onClose();
        },
        onError: error => {
          console.error('Error updating profile:', error);
          Alert.alert(i18n.t('profile.error_save'));
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0].message);
      } else {
        console.error('Error saving profile:', error);
        Alert.alert(i18n.t('profile.error_save'));
      }
    }
  };

  const handleChangeAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.base64) {
          const fileExt = file.uri.split('.').pop()?.toLowerCase() ?? 'png';
          setNewImageData({
            uri: file.uri,
            base64: file.base64,
            fileExtension: fileExt,
          });
        }
      }
    } catch (error) {
      console.error('Error selecting avatar:', error);
      Alert.alert(i18n.t('profile.error_avatar'));
    }
  };

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={i18n.t('profile.drawer_title')}>
      <VStack space="lg" className="mb-20 w-full flex-1 p-4">
        <Center className="flex w-full gap-4">
          <PhotoUpload
            onImageUpload={imageData => setNewImageData(imageData)}
            uri={
              newImageData?.uri ??
              profile?.avatar_url ??
              (user?.user_metadata?.avatar_url as string) ??
              undefined
            }
          />
          <Button onPress={handleChangeAvatar} variant="outline">
            <ButtonText>
              {i18n.t('profile.drawer_image_upload_label')}
            </ButtonText>
          </Button>
        </Center>

        <VStack space="md">
          <VStack>
            <FormInputLabel label={i18n.t('profile.drawer_first_name_label')} />
            <Input>
              <InputField
                value={firstName}
                onChangeText={setFirstName}
                placeholder={i18n.t('profile.input_placeholder_first_name')}
              />
            </Input>
          </VStack>

          <VStack>
            <FormInputLabel label={i18n.t('profile.drawer_last_name_label')} />
            <Input>
              <InputField
                value={lastName}
                onChangeText={setLastName}
                placeholder={i18n.t('profile.input_placeholder_last_name')}
              />
            </Input>
          </VStack>

          {validationError && (
            <Text className="text-red-500">{validationError}</Text>
          )}
        </VStack>

        <HStack space="md" className="mt-auto justify-end">
          <Button variant="outline" onPress={onClose}>
            <ButtonText>{i18n.t('profile.button_cancel')}</ButtonText>
          </Button>
          <Button onPress={handleSave} isDisabled={isLoading}>
            <ButtonText>
              {isLoading
                ? i18n.t('profile.button_saving')
                : i18n.t('profile.button_save')}
            </ButtonText>
          </Button>
        </HStack>
      </VStack>
    </BottomDrawer>
  );
};
