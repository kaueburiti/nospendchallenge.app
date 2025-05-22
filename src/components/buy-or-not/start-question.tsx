import {
  ButtonText,
  Input,
  InputField,
  Text,
  VStack,
  Button,
  Box,
  Heading,
  Spinner,
} from '@/components/ui';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import shoppingreceipt from '@/assets/animations/shopping-receipt.json';
import LottieViewWrapper from '../lottie-view-wrapper';

interface StartQuestionProps {
  onStart: (productName: string) => void;
  isLoading?: boolean;
}

export function StartQuestion({ onStart, isLoading }: StartQuestionProps) {
  const [productName, setProductName] = useState('');

  const handleStart = () => {
    if (productName.trim()) {
      onStart(productName.trim());
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <VStack
        space="md"
        className="my-8 flex flex-1 items-center justify-center">
        <VStack space="4xl">
          <VStack space="lg" className="items-center">
            <LottieViewWrapper height={192} width={192}>
              <LottieView
                source={shoppingreceipt}
                autoPlay
                style={{ width: 250, height: 250 }}
              />
            </LottieViewWrapper>
            <Heading size="3xl" className="text-center">
              Should I Buy or Not?
            </Heading>
            <Text className="text-muted-foreground text-center">
              Sometimes we don&apos;t know if it&apos;s a fair buy or just a
              impulsive behavior. Let&apos;s find out if it&apos;s a good idea.
            </Text>
          </VStack>
          <Input size={'3xl'} className="rounded-lg">
            <InputField
              className="bg-white text-center text-xl font-bold"
              placeholder="What do you want to buy?"
              value={productName}
              onChangeText={setProductName}
              editable={!isLoading}
            />
          </Input>
        </VStack>

        <Box className="mt-auto">
          <Button
            size="xl"
            className="w-full"
            onPress={handleStart}
            isDisabled={!productName.trim() || isLoading}>
            <ButtonText className="w-full text-center">
              {isLoading ? (
                <Box className="flex w-full flex-row items-center justify-center">
                  <Spinner size="small" color="white" />
                </Box>
              ) : (
                <ButtonText className="w-full text-center">Start</ButtonText>
              )}
            </ButtonText>
          </Button>
        </Box>
      </VStack>
    </TouchableWithoutFeedback>
  );
}
