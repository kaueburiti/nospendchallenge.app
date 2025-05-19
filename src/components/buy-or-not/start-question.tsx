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
import React, { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

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
        <VStack space="lg" className="flex-1 justify-center">
          <Heading size="2xl" className="text-center">
            Should I Buy or Not?
          </Heading>
          <Text className="text-muted-foreground text-center">
            Sometimes we don&apos;t know if it&apos;s a fair buy or just a
            impulsive behavior. Let&apos;s find out if it&apos;s a good idea.
          </Text>
          <Text className="text-muted-foreground text-center">
            Describe the item you&apos;re considering to buy:
          </Text>
          <Input size={'3xl'}>
            <InputField
              className="bg-white text-center text-3xl font-bold"
              placeholder="A new pair of shoes"
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
            {isLoading ? (
              <Spinner size="small" color="$white" />
            ) : (
              <ButtonText className="w-full text-center">Start</ButtonText>
            )}
          </Button>
        </Box>
      </VStack>
    </TouchableWithoutFeedback>
  );
}
