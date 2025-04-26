import React, { useState } from 'react';
import { Box, VStack } from '@/components/ui';
import { Text } from '@/components/ui';
import GuestLayout from '../../components/GuestLayout';
import { Center } from '@/components/ui';
import { Heading } from '@/components/ui';
import { Link as ExpoLink } from 'expo-router';
import { LinkText } from '@/components/ui';
import OtpEmailForm from '@/components/sign-in/OtpEmailForm';
import OtpVerificationForm from '@/components/sign-in/OtpVerificationForm';

const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [showVerification, setShowVerification] = useState(false);

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setShowVerification(true);
  };

  const handleResendCode = () => {
    // This function is just to provide feedback to the user
    // The actual resending is handled in the OtpVerificationForm
  };

  return (
    <GuestLayout>
      <VStack className={'flex-1 px-4 py-12'}>
        <Center className={'mb-4'}>
          <Box className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-500">
            <Text className="mt-2 text-6xl font-bold text-white">#</Text>
          </Box>
        </Center>
        <Heading className={'mb-12 text-center text-3xl'}>
          {showVerification ? 'Verify your email' : 'Welcome!'}
        </Heading>

        {showVerification ? (
          <OtpVerificationForm email={email} onResendCode={handleResendCode} />
        ) : (
          <OtpEmailForm onEmailSubmit={handleEmailSubmit} />
        )}

        <Text className="mt-8 text-center">
          Don&apos;t have an account?{' '}
          <ExpoLink href="/sign-up">
            <LinkText className="text-primary-500 underline">Sign up</LinkText>
          </ExpoLink>
        </Text>
      </VStack>
    </GuestLayout>
  );
};

export default SignIn;
