import React, { useEffect } from 'react';
import { Box, Button, Heading, FormControl, VStack } from '@/components/ui';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { ScrollView } from '@/components/ui/scroll-view';
import { useTranslation } from '@/hooks/useTranslation';
import { Section } from '@/components/Section';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type WishlistItemFormValues,
  wishlistItemSchema,
} from '@/lib/schema/wishlist';
import { useGetWishlistItem, useUpdateWishlistItem } from '@/hooks/wishlists';
import BackButton from '@/components/navigation/back-button';
import { useLocalSearchParams } from 'expo-router';
import { FormInputLabel } from '@/components/ui/form/label';
import { FormControlError, FormControlErrorText } from '@/components/ui';
import { ActivityIndicator } from 'react-native';

export default function EditWishlistItemPage() {
  const { t } = useTranslation();
  const { id, itemId } = useLocalSearchParams<{ id: string; itemId: string }>();
  const { data: item, isLoading } = useGetWishlistItem(Number(itemId));
  const { mutate: updateItem, isPending } = useUpdateWishlistItem(Number(id));

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
      cost: 0,
      photo: '',
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        description: item.description || '',
        cost: Number(item.cost),
        photo: item.photo || '',
      });
    }
  }, [item, reset]);

  const onSubmit = (data: WishlistItemFormValues) => {
    if (!item) return;

    updateItem({
      id: item.id,
      name: data.name,
      description: data.description || null,
      cost: data.cost,
      photo: data.photo || null,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView>
        <Box className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Box className="p-4">
          <BackButton />
          <Section>
            <VStack space="xl" className="mt-4">
              <Heading size="2xl">{t('wishlists.edit_item')}</Heading>

              <VStack space="md">
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
                          placeholder={t(
                            'wishlists.form.item_name.placeholder',
                          )}
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
                          value={value.toString()}
                          onChangeText={value => {
                            // Parse string to number
                            const numValue = parseFloat(value);
                            onChange(isNaN(numValue) ? 0 : numValue);
                          }}
                          placeholder={t(
                            'wishlists.form.item_cost.placeholder',
                          )}
                          keyboardType="numeric"
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

                <FormControl isInvalid={!!errors.photo}>
                  <FormInputLabel
                    label={t('wishlists.form.item_photo.label')}
                  />
                  <Controller
                    control={control}
                    name="photo"
                    render={({ field: { onChange, value } }) => (
                      <Input>
                        <InputField
                          value={value}
                          onChangeText={onChange}
                          placeholder={t(
                            'wishlists.form.item_photo.placeholder',
                          )}
                        />
                      </Input>
                    )}
                  />
                  {errors.photo && (
                    <FormControlError>
                      <FormControlErrorText>
                        {t('wishlists.form.item_photo.error')}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </VStack>

              <Button
                onPress={handleSubmit(onSubmit)}
                isDisabled={isPending}
                className="mt-6">
                {isPending
                  ? t('wishlists.form.saving_button')
                  : t('wishlists.form.update_button')}
              </Button>
            </VStack>
          </Section>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
