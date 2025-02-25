import React from 'react';
import { Box, VStack } from '@/components/ui';
import { Text } from '@/components/ui';
import GuestLayout from '../../components/GuestLayout';
import { Center } from '@/components/ui';
import { Heading } from '@/components/ui';
import { Link as ExpoLink } from 'expo-router';
import { LinkText } from '@/components/ui';
import SignInForm from '../../components/sign-in/SignInForm';

const SignIn = () => {
  return (
    <GuestLayout>
      <VStack className={'flex-1 px-4 py-12'}>
        <Center className={'mb-4'}>
          <Box className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-500">
            <Text className="mt-2 text-6xl font-bold text-white">#</Text>
          </Box>
        </Center>
        <Heading className={'mb-12 text-center text-3xl'}>
          Welcome Back!
        </Heading>
        <SignInForm />
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
