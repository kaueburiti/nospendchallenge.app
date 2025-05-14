import React, { useEffect, useState } from 'react';
import { Button, ButtonText } from '../ui/button';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { BottomDrawer } from '../BottomDrawer';
import { useSimpleToast } from '@/hooks/useSimpleToast';
import { useTranslation } from '@/hooks/useTranslation';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from '@/components/ui';
import { FormInputLabel } from '@/components/ui/form/label';
import { Controller } from 'react-hook-form';
import { z } from 'zod';
import {
  useCreateWishlistItem,
  useGetWishlistItem,
  useUpdateWishlistItem,
} from '@/hooks/wishlists';
import { supabase } from '@/lib/supabase';
import PhotoUpload from '../ui/photo-upload';
import useUploadImage from '@/hooks/storage';

// Form schema for wishlist item
const wishlistItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  cost: z.string().refine(val => !isNaN(Number(val)), {
    message: 'Cost must be a valid number',
  }),
  photo: z.string().optional(),
});

interface ImageData {
  uri: string;
  base64: string;
  fileExtension: string;
}

type WishlistItemFormValues = z.infer<typeof wishlistItemSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemId?: number;
}

export const EditWishlistItemDrawer = ({ isOpen, onClose, itemId }: Props) => {
  const { t } = useTranslation();
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const { data: item, isLoading: isItemLoading } = useGetWishlistItem(
    itemId ?? 0,
    {
      enabled: !!itemId,
    },
  );
  const { mutate: createItem, isPending: isCreating } = useCreateWishlistItem();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateWishlistItem();
  const { showToast } = useSimpleToast();
  const { upload } = useUploadImage();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WishlistItemFormValues>({
    resolver: zodResolver(wishlistItemSchema),
    defaultValues: {
      name: '',
      description: '',
      cost: '',
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        description: item.description ?? '',
        cost: item.cost.toString(),
        photo: item.photo ?? '',
      });

      if (item.photo) {
        setImageData({
          uri: item.photo,
          base64: '',
          fileExtension: 'png',
        });
      }
    } else {
      reset({
        name: '',
        description: '',
        cost: '',
      });
    }
  }, [item, reset]);

  const isLoading = isItemLoading || isCreating || isUpdating;

  const onSubmit = async (data: WishlistItemFormValues) => {
    try {
      let photo = data.photo;

      if (imageData) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        photo =
          (await upload({
            bucket: 'wishlists',
            name: `${data.name}-photo-${itemId}.${imageData.fileExtension}`,
            path: String(itemId),
            image: imageData,
          })) ?? undefined;
      }

      if (itemId) {
        // Update existing item
        updateItem(
          {
            id: itemId,
            item: {
              name: data.name,
              description: data.description ?? null,
              cost: Number(data.cost),
              photo: photo,
            },
          },
          {
            onSuccess: () => {
              onClose();
              showToast('success', 'Item updated successfully');
            },
            onError: error => {
              console.error('Error updating item:', error);
              showToast(
                'error',
                'Error updating item',
                'Please, try again later',
              );
            },
          },
        );
      } else {
        // Create new item
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        createItem(
          {
            name: data.name,
            description: data.description ?? null,
            cost: Number(data.cost),
            user_id: userData.user.id,
            photo: photo ?? null,
          },
          {
            onSuccess: () => {
              onClose();
              showToast('success', 'Item created successfully');
            },
            onError: error => {
              console.error('Error creating item:', error);
              showToast(
                'error',
                'Error creating item',
                'Please, try again later',
              );
            },
          },
        );
      }
    } catch (error) {
      console.error('Error saving item:', error);
      showToast('error', 'Error saving item', 'Please, try again later');
    }
  };

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={itemId ? t('wishlists.edit_item') : t('wishlists.add_item')}>
      <VStack space="xs" className="mb-2 w-full p-4">
        <VStack space="md">
          <PhotoUpload
            onImageUpload={setImageData}
            uri={imageData?.uri ?? process.env.EXPO_PUBLIC_CHALLENGE_COVER_URL!}
          />

          <FormControl isInvalid={!!errors.name}>
            <FormInputLabel label={t('wishlists.form.item_name.label')} />
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input>
                  <InputField
                    value={value}
                    onChangeText={onChange}
                    placeholder={t('wishlists.form.item_name.placeholder')}
                  />
                </Input>
              )}
            />
            {errors.name && (
              <FormControlError>
                <FormControlErrorText>
                  {t('wishlists.form.item_name.error')}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl>
            <FormInputLabel
              label={t('wishlists.form.item_description.label')}
            />
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <Textarea>
                  <TextareaInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={t(
                      'wishlists.form.item_description.placeholder',
                    )}
                  />
                </Textarea>
              )}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.cost}>
            <FormInputLabel label={t('wishlists.form.item_cost.label')} />
            <Controller
              control={control}
              name="cost"
              render={({ field: { onChange, value } }) => (
                <Input>
                  <InputField
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    placeholder={t('wishlists.form.item_cost.placeholder')}
                  />
                </Input>
              )}
            />
            {errors.cost && (
              <FormControlError>
                <FormControlErrorText>
                  {t('wishlists.form.item_cost.error')}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        </VStack>
      </VStack>

      <HStack space="md" className="mb-4 mt-4 justify-end">
        <Button variant="outline" onPress={onClose}>
          <ButtonText>{t('wishlists.form.cancel_button')}</ButtonText>
        </Button>
        <Button onPress={handleSubmit(onSubmit)} isDisabled={isLoading}>
          <ButtonText>
            {isLoading
              ? t('wishlists.form.saving_button')
              : t('wishlists.form.save_button')}
          </ButtonText>
        </Button>
      </HStack>
    </BottomDrawer>
  );
};
