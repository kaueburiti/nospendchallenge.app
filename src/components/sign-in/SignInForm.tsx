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

const SignInForm = () => {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
  });
  const { signInWithPassword } = useSignInWithPassword();

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
      <ExpoLink href="/forgot-password" className="mt-2">
        <LinkText className="text-sm">Forgot password?</LinkText>
      </ExpoLink>
      <Button
        variant="solid"
        size="lg"
        className="mt-5 h-12 bg-[#ff7979]"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}>
        <ButtonText className="text-sm">
          {isSubmitting ? 'Signing in...' : 'Continue'}
        </ButtonText>
      </Button>
    </>
  );
};

export default SignInForm;
