import {
  Button,
  ButtonText,
  HStack,
  Input,
  InputField,
  Text,
  VStack,
} from '@/components/ui';
import React, { useState } from 'react';
import { BaseQuestion, type BaseQuestionProps } from './BaseQuestion';

export function AlternativesQuestion(
  props: Omit<BaseQuestionProps, 'title' | 'description'>,
) {
  const [alternative, setAlternative] = useState('');
  const [alternatives, setAlternatives] = useState<string[]>([]);

  const addAlternative = () => {
    if (alternative.trim()) {
      setAlternatives(prev => [...prev, alternative.trim()]);
      setAlternative('');
    }
  };

  return (
    <BaseQuestion
      title="Have you researched alternatives?"
      description="Check if there are better or more affordable options available."
      {...props}>
      <VStack space="md" className="mb-8">
        <Text className="text-muted-foreground text-center">
          List any alternatives you&apos;ve found:
        </Text>

        <HStack space="sm">
          <Input flex={1}>
            <InputField
              placeholder="Enter alternative"
              value={alternative}
              onChangeText={setAlternative}
              onSubmitEditing={addAlternative}
            />
          </Input>
          <Button onPress={addAlternative}>
            <ButtonText>Add</ButtonText>
          </Button>
        </HStack>

        {alternatives.length > 0 && (
          <VStack space="sm" className="mt-4">
            {alternatives.map((alt, index) => (
              <Text key={index} className="text-muted-foreground">
                • {alt}
              </Text>
            ))}
          </VStack>
        )}
      </VStack>
    </BaseQuestion>
  );
}
