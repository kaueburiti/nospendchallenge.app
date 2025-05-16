import { Button, ButtonText, Text, VStack } from '@/components/ui';
import React from 'react';

export interface BaseQuestionProps {
  title: string;
  description: string;
  onAnswer: (answer: boolean) => void;
  children?: React.ReactNode;
}

export function BaseQuestion({
  title,
  description,
  onAnswer,
  children,
}: BaseQuestionProps) {
  return (
    <VStack space="4xl" className="flex-1 justify-center">
      <VStack space="sm" className="mb-16">
        <Text className="text-foreground text-center text-2xl font-bold">
          {title}
        </Text>
        <Text className="text-muted-foreground text-center text-base">
          {description}
        </Text>
      </VStack>

      {children}

      <VStack space="md">
        <Button size="xl" className="w-full" onPress={() => onAnswer(true)}>
          <ButtonText>Yes</ButtonText>
        </Button>

        <Button
          variant="outline"
          size="xl"
          className="w-full"
          onPress={() => onAnswer(false)}>
          <ButtonText>No</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
