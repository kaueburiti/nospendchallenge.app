import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { Button, ButtonText } from '../ui/button';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Center } from '../ui';
import * as ImagePicker from 'expo-image-picker';
import { z } from 'zod';
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

type ProfileFormData = z.infer<typeof profileSchema>;

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
  const [newImageData, setNewImageData] = React.useState<ImageData | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
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
      });
    }
  }, [profile, reset]);

  const isLoading =
    externalLoading || isProfileLoading || isUpdating || isUploading;

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const profileData = {
        ...data,
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
          await onSave();
          onClose();
        },
        onError: error => {
          console.error('Error updating profile:', error);
          Alert.alert('Error saving profile');
        },
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error saving profile');
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
          <FormInput
            name="first_name"
            placeholder="Enter your first name"
            label="First Name"
            control={control}
            errorMessage={errors.first_name?.message}
          />

          <FormInput
            name="last_name"
            placeholder="Enter your last name"
            label="Last Name"
            control={control}
            errorMessage={errors.last_name?.message}
          />
        </VStack>
      </VStack>

      <HStack space="md" className="mt-auto justify-end">
        <Button variant="outline" onPress={onClose}>
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button onPress={handleSubmit(onSubmit)} isDisabled={isLoading}>
          <ButtonText>{isLoading ? 'Saving...' : 'Save'}</ButtonText>
        </Button>
      </HStack>
    </BottomDrawer>
  );
};
