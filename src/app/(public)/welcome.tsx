import React from 'react';
import { VStack } from '@/components/ui';
import { Center } from '@/components/ui';
import { Heading } from '@/components/ui';
import { router } from 'expo-router';
import { Button, ButtonText } from '@/components/ui';
import GuestLayout from '../../components/GuestLayout';
import { Image } from '@/components/ui';
import type { ImageSourcePropType } from 'react-native';

const Welcome = () => {
  return (
    <GuestLayout>
      <VStack className="flex-1 items-center justify-between px-4 py-12">
        <Center className="mb-8 mt-32">
          <Image
            size="md"
            source={
              require('../../assets/images/logo.png') as ImageSourcePropType
            }
            alt="image"
            className="padding-4 mb-8"
          />
          <Heading className="text-center text-3xl">
            Welcome to NativeExpress!
          </Heading>
        </Center>

        <VStack space="md" className="w-full max-w-sm">
          <Button
            size="lg"
            onPress={() => {
              router.push('/sign-in');
            }}
            variant="solid"
            className="w-full flex-1">
            <ButtonText>Sign In</ButtonText>
          </Button>

          <Button
            size="lg"
            onPress={() => {
              router.push('/sign-up');
            }}
            variant="solid"
            className="w-full flex-1">
            <ButtonText>Sign Up</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default Welcome;
