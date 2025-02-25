import React from 'react';
import { Box, Image } from '@/components/ui';
import * as ImagePicker from 'expo-image-picker';
import { Pressable, Alert } from 'react-native';
import { ImagePlus } from 'lucide-react-native';

interface ImageData {
  uri: string;
  base64: string;
  fileExtension: string;
}

interface PhotoUploadProps {
  onImageUpload: (imageData: ImageData) => void;
  uri?: string;
}

export default function PhotoUpload({ onImageUpload, uri }: PhotoUploadProps) {
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.base64) {
          const fileExt = file.uri.split('.').pop()?.toLowerCase() ?? 'png';
          onImageUpload({
            uri: file.uri,
            base64: file.base64,
            fileExtension: fileExt,
          });
        }
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Failed to select image. Please try again.');
    }
  };

  return (
    <Pressable onPress={pickImage} className="mb-4 items-center">
      <Box className="h-64 w-64 items-center justify-center overflow-hidden rounded-full border-[12px] border-primary-500 bg-primary-0">
        {uri ? (
          <Image
            source={{ uri }}
            className="h-full w-full"
            alt="Challenge cover"
          />
        ) : (
          <ImagePlus size={64} color="white" />
        )}
      </Box>
    </Pressable>
  );
}
