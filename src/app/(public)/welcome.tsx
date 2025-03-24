import React from 'react';
import { Box, VStack } from '@/components/ui';
import { Center } from '@/components/ui';
import { Heading } from '@/components/ui';
import { router } from 'expo-router';
import { Button, ButtonText, Text } from '@/components/ui';
import GuestLayout from '../../components/GuestLayout';
import { Span } from '@expo/html-elements';
import MeditatingWoman from '@/components/ui/illustrations/meditating-woman';

// FEATURE: Add a splash screen
const Welcome = () => {
  return (
    <GuestLayout>
      <VStack className="relative flex-1 items-center px-4 py-12">
        <Center className="absolute bottom-0 overflow-visible">
          <Box className="animate-float">
            <MeditatingWoman height={425} width={425} />
          </Box>
        </Center>

        <VStack space="md" className="mt-24 w-full max-w-sm">
          <Box className="mb-12 flex flex-col gap-2 text-center">
            <Heading className="mb-1 text-center text-4xl">
              Welcome to #<Span className="text-[#ff7979]">NoSpend</Span>
              Challenge
            </Heading>
            <Text className="text-center">
              Create challenges to help you on your journey to financial
              control!
            </Text>
          </Box>

          <Box className="flex flex-col items-center gap-4">
            <Button
              size="lg"
              onPress={() => {
                router.push('/sign-up');
              }}
              className="w-full flex-1">
              <ButtonText>Create Account</ButtonText>
            </Button>

            <Button
              size="lg"
              onPress={() => {
                router.push('/sign-in');
              }}
              variant="link"
              className="w-full flex-1">
              <ButtonText className="underline">
                I already have an account
              </ButtonText>
            </Button>
          </Box>
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default Welcome;
