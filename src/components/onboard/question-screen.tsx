import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  ButtonText,
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  Heading,
  Input,
  InputField,
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  Text,
  VStack,
} from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: 'single' | 'multiple' | 'text';
  options: QuestionOption[];
  allowOther?: boolean;
}

interface QuestionScreenProps {
  question: Question;
  onAnswer: (answers: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  isLastQuestion: boolean;
  isFirstQuestion: boolean;
}

export default function QuestionScreen({
  question,
  onAnswer,
  onNext,
  onBack,
  isLastQuestion,
  isFirstQuestion,
}: QuestionScreenProps) {
  const { t } = useTranslation();
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  // Reset selectedAnswers when question changes
  useEffect(() => {
    setSelectedAnswers([]);
  }, [question.id]);

  const handleAnswer = (value: string) => {
    if (question.type === 'single') {
      setSelectedAnswers([value]);
    } else if (question.type === 'multiple') {
      setSelectedAnswers(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value],
      );
    }
  };

  const handleNext = () => {
    const answers = selectedAnswers;
    onAnswer(answers);
    onNext();
  };

  const hasSelected = selectedAnswers.length > 0;
  const isNextDisabled = !hasSelected;

  return (
    <Box className="h-full w-screen flex-1 flex-col justify-center px-8">
      <VStack className="items-center" space="4xl">
        <VStack className="w-full" space="xl">
          <Heading size="xl" className="text-center text-neutral-900">
            {question.title}
          </Heading>
          {question.description && (
            <Text className="text-center text-neutral-600">
              {question.description}
            </Text>
          )}

          {question.type === 'single' ? (
            <RadioGroup
              value={selectedAnswers[0]}
              onChange={value => handleAnswer(value)}
              className="mt-4">
              <VStack space="md">
                {question.options.map(option => (
                  <Radio
                    key={option.id}
                    value={option.value}
                    className="flex-row items-center">
                    <RadioIndicator />
                    <Text className="ml-3 text-neutral-900">
                      {option.label}
                    </Text>
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
          ) : (
            <VStack space="md">
              {question.options.map(option => (
                <Checkbox
                  key={option.id}
                  value={option.value}
                  isChecked={selectedAnswers.includes(option.value)}
                  onChange={() => handleAnswer(option.value)}
                  className="flex-row items-center">
                  <CheckboxIndicator />
                  <Text className="ml-3 text-neutral-900">{option.label}</Text>
                </Checkbox>
              ))}
            </VStack>
          )}
        </VStack>

        <Box className="flex w-full flex-row justify-between">
          <Button
            onPress={onBack}
            size="lg"
            variant="outline"
            isDisabled={isFirstQuestion}>
            <ButtonText>Back</ButtonText>
          </Button>
          <Button onPress={handleNext} size="lg" isDisabled={isNextDisabled}>
            <ButtonText>{isLastQuestion ? 'Finish' : 'Next'}</ButtonText>
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
