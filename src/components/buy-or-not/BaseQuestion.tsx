import { Button, ButtonText, Text, VStack } from '@/components/ui';
import React from 'react';
import { Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';

export interface BaseQuestionProps {
  title: string;
  description: string;
  onAnswer: (answer: boolean) => void;
  handleStart: () => void;
  children?: React.ReactNode;
}

export function BaseQuestion({
  title,
  description,
  onAnswer,
  handleStart,
  children,
}: BaseQuestionProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <VStack space="4xl" className="flex-1 justify-center">
        {children}
      </VStack>
    </TouchableWithoutFeedback>
  );
}
