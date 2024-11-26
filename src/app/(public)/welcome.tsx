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
      <VStack className="py-12 px-4 flex-1 justify-between items-center">
        <Center className="mb-8 mt-32">
            <Image
              size="md"
              source={require('../../assets/images/logo.png') as ImageSourcePropType}
              alt="image"
              className="mb-8 padding-4"
            />
          <Heading className="text-3xl text-center">
            Welcome to NativeExpress!
          </Heading>
        </Center>

        <VStack space="md" className="w-full max-w-sm">

            <Button size="lg" onPress={() => {router.push('/sign-in')}} variant="solid" className="flex-1 w-full">
              <ButtonText>Sign In</ButtonText>
            </Button>


            <Button size="lg" onPress={() => {router.push('/sign-up')}} variant="solid" className="flex-1 w-full">
              <ButtonText>Sign Up</ButtonText>
            </Button>

        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default Welcome;