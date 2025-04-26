import React from 'react';
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
import { type WishlistFormValues, wishlistSchema } from '@/lib/schema/wishlist';
import { useCreateWishlist } from '@/hooks/wishlists';
import BackButton from '@/components/navigation/back-button';
import { supabase } from '@/lib/supabase';
import { FormInputLabel } from '@/components/ui/form/label';
import { FormControlError, FormControlErrorText } from '@/components/ui';

export default function CreateWishlistPage() {
  const { t } = useTranslation();
  const { mutate: createWishlist, isPending } = useCreateWishlist();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WishlistFormValues>({
    resolver: zodResolver(wishlistSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: WishlistFormValues) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    createWishlist({
      title: data.title,
      description: data.description || null,
      user_id: userData.user.id,
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Box className="p-4">
          <BackButton />
          <Section>
            <VStack space="xl" className="mt-4">
              <Heading size="2xl">{t('wishlists.create_wishlist')}</Heading>

              <VStack space="md">
                <FormControl isInvalid={!!errors.title}>
                  <FormInputLabel label={t('wishlists.form.title.label')} />
                  <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, value } }) => (
                      <Input>
                        <InputField
                          value={value}
                          onChangeText={onChange}
                          placeholder={t('wishlists.form.title.placeholder')}
                        />
                      </Input>
                    )}
                  />
                  {errors.title && (
                    <FormControlError>
                      <FormControlErrorText>
                        {t('wishlists.form.title.error')}
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
