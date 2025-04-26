import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Keyboard } from 'react-native';
import { VStack } from '../ui/vstack';
import { Button, ButtonText } from '../ui/button';
import FormInput from '@/components/ui/form/input';
import { useSignInWithOtp } from '@/hooks/auth/useSignInWithOtp';
import { otpEmailSchema, type OtpEmailSchemaType } from '@/lib/schema/otp';

type OtpEmailFormProps = {
  onEmailSubmit: (email: string) => void;
};

const OtpEmailForm = ({ onEmailSubmit }: OtpEmailFormProps) => {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<OtpEmailSchemaType>({
    resolver: zodResolver(otpEmailSchema),
  });

  const { signInWithOtp, isLoading } = useSignInWithOtp();

  const onSubmit = async (data: OtpEmailSchemaType) => {
    await signInWithOtp({
      email: data.email,
      onSuccess: () => onEmailSubmit(data.email),
    });
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    void handleSubmit(onSubmit)();
  };

  return (
    <VStack className="justify-between gap-4">
      <FormInput
        name="email"
        control={control}
        placeholder="Email"
        errorMessage={errors.email?.message}
        onSubmitEditing={handleKeyPress}
      />
      <Button
        variant="solid"
        size="lg"
        className="mt-5 h-12 bg-[#ff7979]"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading || isSubmitting}>
        <ButtonText className="text-sm">
          {isLoading ? 'Sending code...' : 'Send verification code'}
        </ButtonText>
      </Button>
    </VStack>
  );
};

export default OtpEmailForm;
