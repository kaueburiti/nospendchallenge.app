import React from 'react';
import { VStack } from '@/components/ui';
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
      <VStack className={'py-12 px-4 flex-1'}>
        <Center className={'mb-8'}>
          <Image
            size="md"
            source={require('../../assets/images/icon.png') as ImageSourcePropType}
            alt="image"
          />
        </Center>
        <Heading className={'text-3xl text-center mb-8'}>
          Create an account
        </Heading>
        <SignUpForm />
        <Text className={'text-center font-bold my-4'}>or</Text>
        <AuthButton
          provider="Google"
          onPress={handleGoogleSignIn}
        />
        <AuthButton
          provider="Apple"
          onPress={handleAppleSignIn}
        />
        <Text className={'text-center mt-auto'}>
          Already have an account?{' '}
          <ExpoLink href="/sign-in">
            <LinkText>Sign in</LinkText>
          </ExpoLink>
        </Text>
      </VStack>
    </GuestLayout>
  );
};

export default SignUp;
