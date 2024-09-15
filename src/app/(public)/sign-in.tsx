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
      <VStack className={'py-12 px-4 flex-1'}>
        <Center className={'mb-8'}>
          <Image
            size="md"
            source={require('../../assets/images/icon.png') as ImageSourcePropType}
            alt="image"
          />
        </Center>
        <Heading className={'text-3xl text-center mb-8'}>Sign in</Heading>
        <SignInForm />
        <Text className={'text-center font-bold my-4'}>or</Text>
        <AuthButton
          provider="Google"
          onPress={handleGoogleSignIn}
        />
        {Platform.OS === 'ios' && (
          <AuthButton
            provider="Apple"
            onPress={handleAppleSignIn}
          />
        )}
        <Text className="text-center mt-auto">
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
