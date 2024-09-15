import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Keyboard } from 'react-native';
import { VStack } from '../ui/vstack';
import { Link as ExpoLink } from 'expo-router';
import { LinkText } from '../ui/link';
import { Button, ButtonText } from '../ui/button';
import { useSignInWithPassword } from '@/hooks/auth/useSignInWithPassword';
import FormInput from '../auth/FormInput';
import { signInSchema, type SignInSchemaType } from '@/lib/schema/signIn';

const SignInForm = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
  });
  const { signInWithPassword, isLoading } = useSignInWithPassword();

  const onSubmit = async (data: SignInSchemaType) => {
    await signInWithPassword({
      email: data.email,
      password: data.password,
      onSuccess: () => reset(),
    });
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    void handleSubmit(onSubmit)();
  };

  return (
    <>
      <VStack className="justify-between gap-4">
        <FormInput
          name="email"
          control={control}
          placeholder="Email"
          errorMessage={errors.email?.message}
          onSubmitEditing={handleKeyPress}
        />
        <FormInput
          name="password"
          control={control}
          placeholder="Password"
          errorMessage={errors.password?.message}
          isPassword
          onSubmitEditing={handleKeyPress}
        />
      </VStack>
      <ExpoLink href="/forgot-password">
        <LinkText className="text-sm">Forgot password?</LinkText>
      </ExpoLink>
      <Button
        variant="solid"
        size="lg"
        className="mt-5 h-12"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}>
        <ButtonText className="text-sm">
          {isLoading ? 'Signing in...' : 'Continue'}
        </ButtonText>
      </Button>
    </>
  );
};

export default SignInForm;
