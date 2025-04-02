import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Keyboard } from 'react-native';
import { VStack } from '../ui/vstack';
import { Link as ExpoLink } from 'expo-router';
import { LinkText } from '../ui/link';
import { Button, ButtonText } from '../ui/button';
import { useSignInWithPassword } from '@/hooks/auth/useSignInWithPassword';
import FormInput from '@/components/ui/form/input';
import { signInSchema, type SignInSchemaType } from '@/lib/schema/signIn';
import { useTranslation } from '@/hooks/useTranslation';

export default function SignInForm() {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
  });

  const { signInWithPassword, isLoading } = useSignInWithPassword();

  const onSubmit = async (data: SignInSchemaType) => {
    Keyboard.dismiss();
    await signInWithPassword({
      email: data.email,
      password: data.password,
      onSuccess: () => {
        // Handle success
      },
    });
  };

  return (
    <VStack className="justify-between gap-4">
      <FormInput
        control={control}
        name="email"
        placeholder={t('auth.email')}
        autoCapitalize="none"
        errorMessage={errors.email?.message}
      />

      <FormInput
        control={control}
        name="password"
        placeholder={t('auth.password')}
        isPassword
        errorMessage={errors.password?.message}
      />

      <ExpoLink href="/forgot-password" className="mt-2">
        <LinkText className="text-sm">{t('auth.forgot_password')}</LinkText>
      </ExpoLink>

      <Button
        variant="solid"
        size="lg"
        className="mt-5 h-12 bg-[#ff7979]"
        onPress={handleSubmit(onSubmit)}
        isDisabled={isLoading || isSubmitting}>
        <ButtonText className="text-sm">
          {isLoading || isSubmitting
            ? t('auth.signing_in')
            : t('auth.continue')}
        </ButtonText>
      </Button>
    </VStack>
  );
}
