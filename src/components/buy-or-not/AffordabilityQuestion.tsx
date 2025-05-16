import { Input, InputField, Text, VStack } from '@/components/ui';
import React, { useState } from 'react';
import { BaseQuestion, type BaseQuestionProps } from './BaseQuestion';

export function AffordabilityQuestion(
  props: Omit<BaseQuestionProps, 'title' | 'description'>,
) {
  const [price, setPrice] = useState('');

  return (
    <BaseQuestion
      title="Can you afford it?"
      description="Make sure this purchase won't impact your essential expenses or savings goals."
      {...props}>
      <VStack space="md" className="mb-8">
        <Text className="text-muted-foreground text-center">
          Enter the item's price to help you decide:
        </Text>
        <Input>
          <InputField
            keyboardType="numeric"
            placeholder="Enter price"
            value={price}
            onChangeText={setPrice}
          />
        </Input>
      </VStack>
    </BaseQuestion>
  );
}
