import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Button, ButtonText } from '../ui/button';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { Center, Input, InputField } from '../ui';
import * as ImagePicker from 'expo-image-picker';
import { z } from 'zod';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { BottomDrawer } from '../BottomDrawer';
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
    .min(2, 'Name must be at least 2 characters long')
    .optional(),
  last_name: z
    .string()
    .min(2, 'Last Name must be at least 2 characters long')
    .optional(),
  display_name: z
    .string()
    .min(2, 'Display Name must be at least 2 characters long')
    .optional(),
  avatar_url: z.string().url('Invalid avatar URL').optional(),
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
      setFirstName(profile.first_name ?? '');
      setLastName(profile.last_name ?? '');
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
          Alert.alert('Error saving profile');
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0].message);
      } else {
        console.error('Error saving profile:', error);
        Alert.alert('Error saving profile');
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
      Alert.alert('Error uploading avatar');
    }
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title="Edit Profile">
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
            <ButtonText>Change Photo</ButtonText>
          </Button>
        </Center>

        <VStack space="md">
          <VStack>
            <FormInputLabel label="First Name" />
            <Input>
              <InputField
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
              />
            </Input>
          </VStack>

          <VStack>
            <FormInputLabel label="Last Name" />
            <Input>
              <InputField
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
              />
            </Input>
          </VStack>

          {validationError && (
            <Text className="text-red-500">{validationError}</Text>
          )}
        </VStack>

        <HStack space="md" className="mt-auto justify-end">
          <Button variant="outline" onPress={onClose}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button onPress={handleSave} isDisabled={isLoading}>
            <ButtonText>{isLoading ? 'Saving...' : 'Save'}</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </BottomDrawer>
  );
};
