import { HStack, Text, VStack } from '@/components/ui';
import React, { useState } from 'react';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { StartQuestion } from '@/components/buy-or-not/start-question';
import { Question } from '@/components/buy-or-not/question';
import { Verdict } from '@/components/buy-or-not/verdict';
import {
  generateBuyOrNotQuestions,
  generateBuyOrNotVerdict,
  type BuyOrNotQuestion,
  type BuyOrNotVerdict,
} from '@/lib/openai';
import PageSafeAreaView from '@/components/layout/page-safe-area-view';

type ScreenState = 'start' | 'questions' | 'verdict';

export default function BuyOrNotScreen() {
  const { t } = useTranslation();
  const [screenState, setScreenState] = useState<ScreenState>('start');
  const [product, setProduct] = useState('');
  const [questions, setQuestions] = useState<BuyOrNotQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    { question: string; answer: string }[]
  >([]);
  const [verdict, setVerdict] = useState<BuyOrNotVerdict | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const progress =
    screenState === 'questions'
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : screenState === 'verdict'
        ? 100
        : 0;

  const handleStart = async (productName: string) => {
    setIsLoading(true);
    try {
      setProduct(productName);
      const generatedQuestions = await generateBuyOrNotQuestions(productName);
      setQuestions(generatedQuestions);
      setScreenState('questions');
    } catch (error) {
      console.error('Error generating questions:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = [
      ...answers,
      { question: currentQuestion.question, answer },
    ];
    setAnswers(newAnswers);

    if (currentQuestionIndex === questions.length - 1) {
      setIsLoading(true);
      try {
        const verdict = await generateBuyOrNotVerdict(product, newAnswers);
        setVerdict(verdict);
        setScreenState('verdict');
      } catch (error) {
        console.error('Error generating verdict:', error);
        // TODO: Show error toast
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    setScreenState('start');
    setProduct('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setVerdict(null);
  };

  const renderContent = () => {
    switch (screenState) {
      case 'start':
        return <StartQuestion onStart={handleStart} isLoading={isLoading} />;
      case 'questions':
        return (
          <Question
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            isLoading={isLoading}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
          />
        );
      case 'verdict':
        return verdict ? (
          <Verdict verdict={verdict} onRestart={handleRestart} />
        ) : null;
    }
  };

  return (
    <PageSafeAreaView>
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <VStack space="lg" className="flex-1 p-4">
          {/* Progress Section */}
          {screenState !== 'start' && (
            <VStack space="sm">
              <HStack className="justify-between">
                <Text className="text-muted-foreground text-sm">
                  {screenState === 'questions'
                    ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
                    : 'Complete'}
                </Text>
                <Text className="text-muted-foreground text-sm">
                  {Math.round(progress)}%
                </Text>
              </HStack>
              <Progress value={progress} className="h-4">
                <ProgressFilledTrack className="rounded-md" />
              </Progress>
            </VStack>
          )}

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}>
            {renderContent()}
          </ScrollView>
        </VStack>
      </KeyboardAvoidingView>
    </PageSafeAreaView>
  );
}
