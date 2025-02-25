import React from 'react';
import { VStack } from '@/components/ui';
import { Text } from '@/components/ui';
import GuestLayout from '../../components/GuestLayout';
import { Image } from '@/components/ui';
import { Center } from '@/components/ui';
import { Heading } from '@/components/ui';
import { Link as ExpoLink } from 'expo-router';
import { LinkText } from '@/components/ui';
import { type ImageSourcePropType } from 'react-native';
import SignInForm from '../../components/sign-in/SignInForm';

const SignIn = () => {
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
