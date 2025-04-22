import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Keyboard } from 'react-native';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Button, ButtonText } from '../ui/button';
import { useSignUp } from '@/hooks/auth/useSignUp';
import FormInput from '@/components/ui/form/input';
import { signUpSchema, type SignUpSchemaType } from '@/lib/schema/signUp';
import { Box } from '../ui/box';

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
      firstName: data.firstName,
      lastName: data.lastName,
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
        <HStack className="gap-4">
          <Box className="flex-1">
            <FormInput
              name="firstName"
              control={control}
              placeholder="First Name"
              errorMessage={errors.firstName?.message}
            />
          </Box>
          <Box className="flex-1">
            <FormInput
              name="lastName"
              control={control}
              placeholder="Last Name"
              errorMessage={errors.lastName?.message}
            />
          </Box>
        </HStack>
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
