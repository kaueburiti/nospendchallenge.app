import React, { useState } from 'react';
import { Pressable, Alert } from 'react-native';
import { Button, ButtonText } from '../ui/button';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Center, Input, InputField } from '../ui';
import * as ImagePicker from 'expo-image-picker';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { BottomDrawer } from '../BottomDrawer';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
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
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: Partial<SupabaseUser> | null;
  onSave: (data: Partial<SupabaseUser['user_metadata']>) => Promise<void>;
  isLoading: boolean;
}) => {
  const [name, setName] = useState<string>((user?.user_metadata?.full_name as string) || '');
  const [newImageData, setNewImageData] = useState<ImageData | null>(null);
  const [validationError, setValidationError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    setValidationError('');
    setUploading(true);

    try {
      const profileData: Partial<SupabaseUser['user_metadata']> = {};

      if (name !== (user?.user_metadata?.full_name as string)) {
        profileData.full_name = name;
      }

      if (newImageData) {
        const fileName = `${user?.id}.${newImageData.fileExtension}`;
        const filePath = `avatars/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from('appboilerplate')
          .upload(filePath, decode(newImageData.base64), {
            contentType: `image/${newImageData.fileExtension}`,
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Failed to upload avatar: ${uploadError.message}`);
        }

        if (data) {
          const { data: publicUrlData } = supabase.storage
            .from('appboilerplate')
            .getPublicUrl(filePath);

          profileData.avatar_url = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
        }
      }

      if (Object.keys(profileData).length > 0) {
        const validatedData = profileSchema.parse(profileData);
        await onSave(validatedData);
      }

      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationError(error.errors[0].message);
      } else {
        console.error('Error saving profile:', error);
        Alert.alert('Error', 'Failed to save profile. Please try again.');
      }
    } finally {
      setUploading(false);
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
      Alert.alert('Error', 'Failed to select avatar. Please try again.');
    }
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <VStack space="lg" className="flex-1 w-full p-4 mb-20">
        <Center className="w-full flex gap-4">
          <Pressable onPress={handleChangeAvatar}>
            <Avatar size="2xl">
              <AvatarImage
                source={{
                  uri: newImageData
                    ? newImageData.uri
                    : (user?.user_metadata?.avatar_url as string),
                }}
              />
            </Avatar>
          </Pressable>
          <Button onPress={handleChangeAvatar} variant="outline">
            <ButtonText>Upload new profile image</ButtonText>
          </Button>
        </Center>
        <VStack space="md">
          <Text>Full Name</Text>
          <Input>
            <InputField
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
            />
          </Input>
          {validationError && (
            <Text className="text-red-500">{validationError}</Text>
          )}
        </VStack>
        <HStack space="md" className="justify-end mt-auto">
          <Button variant="outline" onPress={onClose}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button onPress={handleSave} isDisabled={isLoading || uploading}>
            <ButtonText>
              {isLoading || uploading ? 'Saving...' : 'Save'}
            </ButtonText>
          </Button>
        </HStack>
      </VStack>
    </BottomDrawer>
  );
};