import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  ButtonText,
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CircleIcon,
  Heading,
  Input,
  InputField,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
  Text,
  VStack,
} from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { Circle } from 'lucide-react-native';

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
  illustration?: React.ReactNode;
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
    <Box className="flex-1 bg-primary-50">
      {/* Top illustration section */}
      <Box
        className="w-full items-center justify-center"
        style={{ height: '33%' }}>
        {question.illustration ? (
          question.illustration
        ) : (
          <Box className="mt-8 h-40 w-40 rounded-full bg-neutral-200" />
        )}
      </Box>
      {/* Bottom white rounded container */}
      <Box className="-mt-8 flex-1 rounded-t-3xl border-l border-r border-t border-gray-200 bg-white px-6 pb-6 pt-10">
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
                      <RadioIndicator>
                        <RadioIcon as={Circle} color="#ffb4b4" />
                      </RadioIndicator>
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
                    <Text className="ml-3 text-neutral-900">
                      {option.label}
                    </Text>
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
    </Box>
  );
}
