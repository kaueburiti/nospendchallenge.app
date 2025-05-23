import { useState } from 'react';
import { SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import { Box, HStack } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import { useCaptureEvent } from '@/hooks/analytics/useCaptureEvent';
import QuestionScreen, {
  type Question,
  type QuestionOption,
} from '@/components/onboard/question-screen';
import icon from '@/assets/images/icon.png';

type OnboardingAnswerKey = 'reason' | 'frequency' | 'temptation' | 'support';
type OnboardingAnswers = Partial<
  Record<OnboardingAnswerKey, QuestionOption['value'][]>
>;

const questions: Question[] = [
  {
    id: 'reason' as OnboardingAnswerKey,
    title: "What's your main reason for joining the #NoSpendChallenge?",
    description: 'Choose one or more',
    illustration: (
      <Image
        source={icon}
        className="h-40 w-40 rounded-full bg-primary-500"
        resizeMode="contain"
      />
    ),
    type: 'multiple',
    options: [
      { id: 'save', label: 'I want to save money', value: 'save_money' },
      {
        id: 'control',
        label: 'I want to control impulsive spending',
        value: 'control_spending',
      },
      { id: 'debt', label: "I'm trying to pay off debt", value: 'pay_debt' },
      {
        id: 'fun',
        label: "I'm doing it for fun or self-discipline",
        value: 'fun_discipline',
      },
    ],
  },
  {
    id: 'frequency' as OnboardingAnswerKey,
    title: 'How often do you make impulsive purchases?',
    illustration: (
      <Image
        source={icon}
        className="h-40 w-40 rounded-full bg-primary-500"
        resizeMode="contain"
      />
    ),
    type: 'single',
    options: [
      { id: 'daily', label: 'Almost every day', value: 'daily' },
      { id: 'weekly', label: 'A few times a week', value: 'weekly' },
      { id: 'monthly', label: 'Once or twice a month', value: 'monthly' },
      { id: 'rarely', label: 'Rarely', value: 'rarely' },
    ],
  },
  {
    id: 'temptation' as OnboardingAnswerKey,
    title: "What's your biggest spending temptation?",
    illustration: (
      <Image
        source={icon}
        className="h-40 w-40 rounded-full bg-primary-500"
        resizeMode="contain"
      />
    ),
    type: 'single',
    options: [
      { id: 'clothes', label: 'Clothes & Accessories', value: 'clothes' },
      { id: 'food', label: 'Food Delivery & Snacks', value: 'food' },
      { id: 'tech', label: 'Tech & Gadgets', value: 'tech' },
      { id: 'subs', label: 'Subscriptions & Apps', value: 'subscriptions' },
    ],
  },
  {
    id: 'support' as OnboardingAnswerKey,
    title: 'How do you want the app to support you?',
    description: 'Choose all that apply',
    illustration: (
      <Image
        source={icon}
        className="h-40 w-40 rounded-full bg-primary-500"
        resizeMode="contain"
      />
    ),
    type: 'multiple',
    options: [
      {
        id: 'reflect',
        label: 'Help me reflect before each purchase',
        value: 'reflect',
      },
      {
        id: 'track',
        label: 'Track my savings and overspending',
        value: 'track',
      },
      { id: 'goals', label: 'Remind me of my goals', value: 'goals' },
      { id: 'ai', label: 'Give AI advice before I buy', value: 'ai_advice' },
      { id: 'stats', label: 'Motivate me with progress stats', value: 'stats' },
    ],
  },
];

export default function Onboard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const { captureEvent } = useCaptureEvent();

  const handleAnswer = (
    questionId: OnboardingAnswerKey,
    answer: QuestionOption['value'][],
  ) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Capture onboarding completion event with all answers
      captureEvent('onboarding_completed', {
        reason: answers.reason,
        frequency: answers.frequency?.[0], // Single answer
        temptation: answers.temptation?.[0], // Single answer
        support: answers.support,
      });

      // TODO: Save answers to user profile
      router.replace('/(protected)/paywall');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <Box className="flex-1 bg-white pb-16">
      <Box className="flex-1">
        <QuestionScreen
          question={questions[currentIndex]}
          onAnswer={answer =>
            handleAnswer(
              questions[currentIndex].id as OnboardingAnswerKey,
              answer,
            )
          }
          onNext={handleNext}
          onBack={handleBack}
          isLastQuestion={currentIndex === questions.length - 1}
          isFirstQuestion={currentIndex === 0}
        />
        <HStack space="lg" className="flex justify-center p-4">
          {questions.map((_, index) => (
            <Box
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? 'bg-neutral-900' : 'bg-neutral-300'
              }`}
            />
          ))}
        </HStack>
      </Box>
    </Box>
  );
}
