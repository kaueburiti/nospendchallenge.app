import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Keyboard } from 'react-native';
import { VStack } from '../ui/vstack';
import { Button, ButtonText } from '../ui/button';
import { useSignUp } from '@/hooks/auth/useSignUp';
import FormInput from '@/components/ui/form/input';
import { signUpSchema, type SignUpSchemaType } from '@/lib/schema/signUp';

const SignUpForm = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });

  const { signUp, isLoading } = useSignUp();

  const onSubmit = async (data: SignUpSchemaType) => {
    await signUp({
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
        />
        <FormInput
          name="password"
          control={control}
          placeholder="Password"
          errorMessage={errors.password?.message}
          isPassword
        />
        <FormInput
          name="confirmPassword"
          control={control}
          placeholder="Confirm Password"
          errorMessage={errors.confirmPassword?.message}
          isPassword
          onSubmitEditing={handleKeyPress}
        />
      </VStack>

      <Button
        variant="solid"
        size="lg"
        className="mt-5 h-12 bg-[#ff7979]"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}>
        <ButtonText className="text-sm">
          {isLoading ? 'Signing up...' : 'Create Account'}
        </ButtonText>
      </Button>
    </>
  );
};

export default SignUpForm;
