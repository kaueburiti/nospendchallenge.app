import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Keyboard, Text } from 'react-native';
import { VStack } from '../ui/vstack';
import { Button, ButtonText } from '../ui/button';
import FormInput from '@/components/ui/form/input';
import { useVerifyOtp } from '@/hooks/auth/useVerifyOtp';
import {
  otpVerificationSchema,
  type OtpVerificationSchemaType,
} from '@/lib/schema/otp';
import { useSignInWithOtp } from '@/hooks/auth/useSignInWithOtp';

type OtpVerificationFormProps = {
  email: string;
  onResendCode: () => void;
};

const OtpVerificationForm = ({
  email,
  onResendCode,
}: OtpVerificationFormProps) => {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<OtpVerificationSchemaType>({
    resolver: zodResolver(otpVerificationSchema),
  });

  const { verifyOtp, isLoading: isVerifying } = useVerifyOtp();
  const { signInWithOtp, isLoading: isResending } = useSignInWithOtp();

  const onSubmit = async (data: OtpVerificationSchemaType) => {
    await verifyOtp({
      email,
      token: data.token,
    });
  };

  const handleResendCode = async () => {
    await signInWithOtp({
      email,
      onSuccess: () => onResendCode(),
    });
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    void handleSubmit(onSubmit)();
  };

  return (
    <VStack className="justify-between gap-4">
      <Text className="text-center text-gray-600">
        We sent a verification code to {email}
      </Text>

      <FormInput
        name="token"
        control={control}
        placeholder="Enter verification code"
        errorMessage={errors.token?.message}
        onSubmitEditing={handleKeyPress}
        keyboardType="number-pad"
      />

      <Button
        variant="solid"
        size="lg"
        className="mt-5 h-12 bg-[#ff7979]"
        onPress={handleSubmit(onSubmit)}
        disabled={isVerifying || isSubmitting}>
        <ButtonText className="text-sm">
          {isVerifying ? 'Verifying...' : 'Verify code'}
        </ButtonText>
      </Button>

      <Button variant="link" onPress={handleResendCode} disabled={isResending}>
        <ButtonText className="text-sm">
          {isResending ? 'Sending...' : 'Resend code'}
        </ButtonText>
      </Button>
    </VStack>
  );
};

export default OtpVerificationForm;
