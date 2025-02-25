import React from 'react';
import { Box, VStack } from '@/components/ui';
import { Text } from '@/components/ui';
import GuestLayout from '../../components/GuestLayout';
import { Image } from '@/components/ui';
import { Center } from '@/components/ui';
import { Heading } from '@/components/ui';
import { Link as ExpoLink } from 'expo-router';
import { useSignInWithGoogle } from '@/hooks/auth/useSignInWithGoogle';
import { useSignInWithApple } from '@/hooks/auth/useSignInWithApple';
import { type ImageSourcePropType } from 'react-native';
import SignUpForm from '../../components/sign-up/SignUpForm';
import { LinkText } from '@/components/ui';
import AuthButton from '../../components/auth/AuthButton';
import MeditatingWoman from '@/components/ui/illustrations/meditating-woman';

const SignUp = () => {
  const { signInWithGoogle } = useSignInWithGoogle();
  const { signInWithApple } = useSignInWithApple();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle({});
  };

  const handleAppleSignIn = async () => {
    await signInWithApple({});
  };

  return (
    <GuestLayout>
      <VStack className={'flex-1 px-4 py-12'}>
        <Center className={'mb-6'}>
          <MeditatingWoman width={300} height={300} />
        </Center>
        <Box className="mb-8 flex flex-col items-center gap-2">
          <Heading className={'text-center text-3xl'}>
            Create an account
          </Heading>
          <Text>Start your journey to financial control</Text>
        </Box>

        <SignUpForm />
        {/* <Text className={'text-center font-bold my-4'}>or</Text>
        <AuthButton
          provider="Google"
          onPress={handleGoogleSignIn}
        />
        <AuthButton
          provider="Apple"
          onPress={handleAppleSignIn}
        /> */}
        <Text className={'mt-8 text-center'}>
          Already have an account?{' '}
          <ExpoLink href="/sign-in">
            <LinkText className="text-primary-500 underline">Sign in</LinkText>
          </ExpoLink>
        </Text>
      </VStack>
    </GuestLayout>
  );
};

export default SignUp;
