import {
  Button,
  ButtonText,
  Text,
  VStack,
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
  CircleIcon,
  Spinner,
} from '@/components/ui';
import React from 'react';
import { type BuyOrNotQuestion } from '@/lib/openai';

interface QuestionProps {
  question: BuyOrNotQuestion;
  onAnswer: (answer: string) => void;
  isLastQuestion: boolean;
  isLoading?: boolean;
}

export function Question({
  question,
  onAnswer,
  isLastQuestion,
  isLoading,
}: QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = React.useState<string>('');

  const handleAnswer = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      onAnswer(selectedAnswer);
    }
  };

  return (
    <VStack space="xl" className="flex-1 justify-center">
      <Text className="text-center text-2xl font-bold">
        {question.question}
      </Text>

      <RadioGroup
        value={selectedAnswer}
        onChange={handleAnswer}
        className="space-y-4"
        isDisabled={isLoading}>
        {question.options.map((option, index) => (
          <Radio
            key={index}
            value={option}
            className="flex-row items-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <RadioIndicator className="mr-3">
              <RadioIcon>
                <CircleIcon />
              </RadioIcon>
            </RadioIndicator>
            <RadioLabel className="flex-1 text-lg">{option}</RadioLabel>
          </Radio>
        ))}
      </RadioGroup>

      <Button
        size="xl"
        className="mt-8 w-full"
        isDisabled={!selectedAnswer || isLoading}
        onPress={handleNext}>
        {isLoading ? (
          <Spinner size="small" color="$white" />
        ) : (
          <ButtonText className="w-full text-center">
            {isLastQuestion ? 'Get Verdict' : 'Next Question'}
          </ButtonText>
        )}
      </Button>
    </VStack>
  );
}
