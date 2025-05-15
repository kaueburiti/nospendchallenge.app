import React from 'react';
import {
  Box,
  Button,
  ButtonText,
  Heading,
  Text,
  VStack,
} from '@/components/ui';
import LottieView, { type AnimationObject } from 'lottie-react-native';
import LottieViewWrapper from '@/components/lottie-view-wrapper';

interface EmptyListProps {
  onClick: () => void;
  title: string;
  description: string;
  buttonText: string;
  animation: {
    source: AnimationObject;
    height?: number;
    width?: number;
  };
}

export default function EmptyList({
  onClick,
  title,
  description,
  buttonText,
  animation,
}: EmptyListProps) {
  return (
    <Box className="flex-1 items-center justify-center py-8">
      <VStack space="sm" className="items-center">
        <LottieViewWrapper
          height={animation.height ?? 192}
          width={animation.width ?? 192}>
          <LottieView
            source={animation.source}
            autoPlay
            style={{ width: 250, height: 250 }}
          />
        </LottieViewWrapper>
        <VStack space="4xl">
          <VStack space="xs">
            <Heading size="lg" className="text-center">
              {title}
            </Heading>
            <Text className="max-w-xs text-center text-gray-500">
              {description}
            </Text>
          </VStack>

          <Button onPress={onClick} size="lg">
            <ButtonText>{buttonText}</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
