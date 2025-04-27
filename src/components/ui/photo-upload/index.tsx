import React, { useState, useEffect } from 'react';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  ButtonText,
  Button,
} from '@/components/ui';
import * as ImagePicker from 'expo-image-picker';
import { Pressable, Alert } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
interface ImageData {
  uri: string;
  base64: string;
  fileExtension: string;
}

interface PhotoUploadProps {
  onImageUpload: (imageData: ImageData) => void;
  uri?: string;
  fallbackText?: string;
}

export default function PhotoUpload({
  onImageUpload,
  uri,
  fallbackText,
}: PhotoUploadProps) {
  const { t } = useTranslation();
  const [imageUri, setImageUri] = useState<string | undefined>(uri);

  useEffect(() => {
    setImageUri(uri);
  }, [uri]);

  const handleImageSelection = async () => {
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
          setImageUri(file.uri);
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

  const source = imageUri ? { uri: imageUri } : undefined;
  return (
    <Pressable
      onPress={handleImageSelection}
      className="flex flex-col items-center gap-4">
      <Avatar size="xl" className="rounded-md border-2 border-white">
        <AvatarFallbackText className="mt-4">{fallbackText}</AvatarFallbackText>
        {/* BUG: AvatarImage doesn't show the image right after changing the image */}
        {source && <AvatarImage source={source} className="rounded-md" />}
      </Avatar>

      <Button variant="outline" onPress={handleImageSelection} size="sm">
        <ButtonText>{t('challenge.form.cover.label')}</ButtonText>
      </Button>
    </Pressable>
  );
}
