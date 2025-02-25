import React from 'react';
import { VStack } from '@/components/ui';
import { Text } from '@/components/ui';
import GuestLayout from '../../components/GuestLayout';
import { Image } from '@/components/ui';
import { Center } from '@/components/ui';
import { Heading } from '@/components/ui';
import { Link as ExpoLink } from 'expo-router';
import { LinkText } from '@/components/ui';
import { useSignInWithGoogle } from '@/hooks/auth/useSignInWithGoogle';
import { useSignInWithApple } from '@/hooks/auth/useSignInWithApple';
import { Platform, type ImageSourcePropType } from 'react-native';
import SignInForm from '../../components/sign-in/SignInForm';
import AuthButton from '../../components/auth/AuthButton';

const SignIn = () => {
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
        <Center className={'mb-8'}>
          <Image
            size="md"
            source={
              require('../../assets/images/logo.png') as ImageSourcePropType
            }
            alt="image"
          />
        </Center>
        <Heading className={'mb-8 text-center text-3xl'}>Sign in</Heading>
        <SignInForm />
        {/* <Text className={'text-center font-bold my-4'}>or</Text>
        <AuthButton
          provider="Google"
          onPress={handleGoogleSignIn}
        />
        {Platform.OS === 'ios' && (
          <AuthButton
            provider="Apple"
            onPress={handleAppleSignIn}
          />
        )} */}
        <Text className="mt-auto text-center">
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
