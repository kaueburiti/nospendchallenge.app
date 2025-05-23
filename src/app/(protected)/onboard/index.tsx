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

export default function Onboard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const { captureEvent } = useCaptureEvent();
  const { t } = useTranslation();

  const questions: Question[] = [
    {
      id: 'reason' as OnboardingAnswerKey,
      title: t('onboard.questions.reason.title'),
      description: t('onboard.questions.reason.description'),
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
          id: 'save',
          label: t('onboard.questions.reason.options.save'),
          value: 'save_money',
        },
        {
          id: 'control',
          label: t('onboard.questions.reason.options.control'),
          value: 'control_spending',
        },
        {
          id: 'debt',
          label: t('onboard.questions.reason.options.debt'),
          value: 'pay_debt',
        },
        {
          id: 'fun',
          label: t('onboard.questions.reason.options.fun'),
          value: 'fun_discipline',
        },
      ],
    },
    {
      id: 'frequency' as OnboardingAnswerKey,
      title: t('onboard.questions.frequency.title'),
      illustration: (
        <Image
          source={icon}
          className="h-40 w-40 rounded-full bg-primary-500"
          resizeMode="contain"
        />
      ),
      type: 'single',
      options: [
        {
          id: 'daily',
          label: t('onboard.questions.frequency.options.daily'),
          value: 'daily',
        },
        {
          id: 'weekly',
          label: t('onboard.questions.frequency.options.weekly'),
          value: 'weekly',
        },
        {
          id: 'monthly',
          label: t('onboard.questions.frequency.options.monthly'),
          value: 'monthly',
        },
        {
          id: 'rarely',
          label: t('onboard.questions.frequency.options.rarely'),
          value: 'rarely',
        },
      ],
    },
    {
      id: 'temptation' as OnboardingAnswerKey,
      title: t('onboard.questions.temptation.title'),
      illustration: (
        <Image
          source={icon}
          className="h-40 w-40 rounded-full bg-primary-500"
          resizeMode="contain"
        />
      ),
      type: 'single',
      options: [
        {
          id: 'clothes',
          label: t('onboard.questions.temptation.options.clothes'),
          value: 'clothes',
        },
        {
          id: 'food',
          label: t('onboard.questions.temptation.options.food'),
          value: 'food',
        },
        {
          id: 'tech',
          label: t('onboard.questions.temptation.options.tech'),
          value: 'tech',
        },
        {
          id: 'subs',
          label: t('onboard.questions.temptation.options.subs'),
          value: 'subscriptions',
        },
      ],
    },
    {
      id: 'support' as OnboardingAnswerKey,
      title: t('onboard.questions.support.title'),
      description: t('onboard.questions.support.description'),
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
          label: t('onboard.questions.support.options.reflect'),
          value: 'reflect',
        },
        {
          id: 'track',
          label: t('onboard.questions.support.options.track'),
          value: 'track',
        },
        {
          id: 'goals',
          label: t('onboard.questions.support.options.goals'),
          value: 'goals',
        },
        {
          id: 'ai',
          label: t('onboard.questions.support.options.ai'),
          value: 'ai_advice',
        },
        {
          id: 'stats',
          label: t('onboard.questions.support.options.stats'),
          value: 'stats',
        },
      ],
    },
  ];

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
