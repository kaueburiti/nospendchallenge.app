import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Keyboard } from 'react-native';
import { VStack } from '../ui/vstack';
import { Button, ButtonText } from '../ui/button';
import { useSignUp } from '@/hooks/auth/useSignUp';
import FormInput from '@/components/ui/form/input';
import { signUpSchema, type SignUpSchemaType } from '@/lib/schema/signUp';
import { useTranslation } from '@/hooks/useTranslation';

export default function SignUpForm() {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const { signUp, isLoading } = useSignUp();

  const onSubmit = async (data: SignUpSchemaType) => {
    Keyboard.dismiss();
    await signUp(data);
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

      <FormInput
        control={control}
        name="confirmPassword"
        placeholder={t('auth.confirm_password')}
        isPassword
        errorMessage={errors.confirmPassword?.message}
      />

      <Button
        variant="solid"
        size="lg"
        className="mt-5 h-12 bg-[#ff7979]"
        onPress={handleSubmit(onSubmit)}
        isDisabled={isLoading || isSubmitting}>
        <ButtonText className="text-sm">
          {isLoading || isSubmitting
            ? t('auth.signing_up')
            : t('auth.create_account')}
        </ButtonText>
      </Button>
    </VStack>
  );
}
