import { Button, ButtonText, HStack, Text, VStack } from '@/components/ui';
import React, { useState } from 'react';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { NeedQuestion } from '@/components/buy-or-not/NeedQuestion';
import { AffordabilityQuestion } from '@/components/buy-or-not/AffordabilityQuestion';
import { AlternativesQuestion } from '@/components/buy-or-not/AlternativesQuestion';

interface QuestionAnswer {
  id: number;
  answer: boolean;
  additionalData?: Record<string, unknown>;
}

const questions = [
  {
    id: 1,
    component: NeedQuestion,
  },
  {
    id: 2,
    component: AffordabilityQuestion,
  },
  {
    id: 3,
    component: AlternativesQuestion,
  },
  {
    id: 4,
    component: NeedQuestion, // Reusing NeedQuestion for "Will you use it regularly?"
    title: 'Will you use it regularly?',
    description:
      "Think about how often you'll actually use this item in your daily life.",
  },
  {
    id: 5,
    component: NeedQuestion, // Reusing NeedQuestion for "Is this the right time to buy?"
    title: 'Is this the right time to buy?',
    description:
      'Consider if waiting might lead to better prices or if you really need it now.',
  },
];

export default function BuyOrNotScreen() {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (
    answer: boolean,
    additionalData?: Record<string, unknown>,
  ) => {
    setAnswers(prev => [
      ...prev,
      {
        id: currentQuestion.id,
        answer,
        additionalData,
      },
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // TODO: Handle completion - show results or submit answers
      console.log('Completed!', answers);
    }
  };

  const QuestionComponent = currentQuestion.component;

  return (
    <SafeAreaView className="bg-background flex-1">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <VStack space="lg" className="flex-1 p-4">
          {/* Progress Section */}
          <VStack space="sm">
            <HStack className="justify-between">
              <Text className="text-muted-foreground text-sm">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
              <Text className="text-muted-foreground text-sm">
                {Math.round(progress)}%
              </Text>
            </HStack>
            <Progress value={progress} className="h-4">
              <ProgressFilledTrack className="rounded-md" />
            </Progress>
          </VStack>

          {/* Question Section */}
          <QuestionComponent
            onAnswer={handleAnswer}
            {...(currentQuestion.title && { title: currentQuestion.title })}
            {...(currentQuestion.description && {
              description: currentQuestion.description,
            })}
          />

          <Button onPress={() => setCurrentQuestionIndex(0)}>
            <ButtonText>Reset</ButtonText>
          </Button>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
