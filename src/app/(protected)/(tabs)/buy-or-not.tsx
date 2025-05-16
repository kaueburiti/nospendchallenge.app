import { HStack, Text, VStack } from '@/components/ui';
import React, { useState } from 'react';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { StartQuestion } from '@/components/buy-or-not/start-question';

export default function BuyOrNotScreen() {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const progress = ((currentQuestionIndex + 1) / 5) * 100;

  const handleStart = () => {
    setCurrentQuestionIndex(prev => prev + 1);
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <VStack space="lg" className="flex-1 p-4">
          {/* Progress Section */}
          <VStack space="sm">
            <HStack className="justify-between">
              <Text className="text-muted-foreground text-sm">
                Question {currentQuestionIndex + 1} of 5
              </Text>
              <Text className="text-muted-foreground text-sm">
                {Math.round(progress)}%
              </Text>
            </HStack>
            <Progress value={progress} className="h-4">
              <ProgressFilledTrack className="rounded-md" />
            </Progress>
          </VStack>

          <HStack className="flex-1">
            <StartQuestion onStart={handleStart} />
          </HStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
