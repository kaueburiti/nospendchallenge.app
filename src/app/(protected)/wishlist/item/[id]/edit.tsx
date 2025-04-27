import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  FormControl,
  VStack,
  ButtonText,
} from '@/components/ui';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { ScrollView } from '@/components/ui/scroll-view';
import { useTranslation } from '@/hooks/useTranslation';
import { Section } from '@/components/Section';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetWishlistItem, useUpdateWishlistItem } from '@/hooks/wishlists';
import BackButton from '@/components/navigation/back-button';
import { FormInputLabel } from '@/components/ui/form/label';
import { FormControlError, FormControlErrorText } from '@/components/ui';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';

// Form schema for wishlist item
const wishlistItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  cost: z.string().refine(val => !isNaN(Number(val)), {
    message: 'Cost must be a valid number',
  }),
});

type WishlistItemFormValues = z.infer<typeof wishlistItemSchema>;

export default function EditWishlistItemPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: item, isLoading } = useGetWishlistItem(Number(id));
  const { mutate: updateItem, isPending } = useUpdateWishlistItem();

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
        description: item.description || '',
        cost: item.cost.toString(),
      });
    }
  }, [item, reset]);

  const onSubmit = async (data: WishlistItemFormValues) => {
    if (!item) return;

    updateItem({
      id: item.id,
      item: {
        name: data.name,
        description: data.description || null,
        cost: Number(data.cost),
      },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView>
        <Box className="flex h-full items-center justify-center">
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
                  <FormInputLabel label={t('wishlists.form.name.label')} />
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                      <Input>
                        <InputField
                          value={value}
                          onChangeText={onChange}
                          placeholder={t('wishlists.form.name.placeholder')}
                        />
                      </Input>
                    )}
                  />
                  {errors.name && (
                    <FormControlError>
                      <FormControlErrorText>
                        {t('wishlists.form.name.error')}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                <FormControl>
                  <FormInputLabel
                    label={t('wishlists.form.description.label')}
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
                            'wishlists.form.description.placeholder',
                          )}
                        />
                      </Textarea>
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.cost}>
                  <FormInputLabel label={t('wishlists.form.cost.label')} />
                  <Controller
                    control={control}
                    name="cost"
                    render={({ field: { onChange, value } }) => (
                      <Input>
                        <InputField
                          value={value}
                          onChangeText={onChange}
                          keyboardType="numeric"
                          placeholder={t('wishlists.form.cost.placeholder')}
                        />
                      </Input>
                    )}
                  />
                  {errors.cost && (
                    <FormControlError>
                      <FormControlErrorText>
                        {t('wishlists.form.cost.error')}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>
              </VStack>

              <Button
                onPress={handleSubmit(onSubmit)}
                isDisabled={isPending}
                className="mt-6">
                <ButtonText>
                  {isPending
                    ? t('wishlists.form.saving_button')
                    : t('wishlists.form.save_button')}
                </ButtonText>
              </Button>
            </VStack>
          </Section>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
