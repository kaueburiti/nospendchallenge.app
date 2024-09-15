import React from 'react';
import { VStack } from '@/components/ui';
import { Center } from '@/components/ui';
import { Heading } from '@/components/ui';
import { Link } from 'expo-router';
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
              source={require('../../assets/images/icon.png') as ImageSourcePropType}
              alt="image"
              className="mb-8"
            />
          <Heading className="text-3xl text-center">
            Welcome to NativeExpress!
          </Heading>
        </Center>

        <VStack space="md" className="w-full max-w-sm">
          <Link href="/sign-in">
            <Button size="lg" variant="solid">
              <ButtonText>Sign In</ButtonText>
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="lg" variant="outline">
              <ButtonText>Sign Up</ButtonText>
            </Button>
          </Link>
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default Welcome;