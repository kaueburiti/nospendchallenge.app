import {
  Button,
  ButtonText,
  Text,
  VStack,
  Box,
  Heading,
} from '@/components/ui';
import React from 'react';
import { type BuyOrNotVerdict } from '@/lib/openai';
import { CheckCircle, XCircle } from 'lucide-react-native';
import { ScrollView } from '../ui/scroll-view';

interface VerdictProps {
  verdict: BuyOrNotVerdict;
  onRestart: () => void;
}

export function Verdict({ verdict, onRestart }: VerdictProps) {
  const Icon = verdict.isImpulsive ? XCircle : CheckCircle;
  const iconColor = verdict.isImpulsive ? '#E63535' : '#1ABC9C';

  return (
    <ScrollView className="flex-1">
      <VStack space="sm" className="flex-1 p-4">
        <Box className="items-center">
          <Icon size={64} color={iconColor} />
          <Heading size="2xl" className="mt-4 text-center">
            {verdict.isImpulsive
              ? 'Impulsive Purchase'
              : 'Well-Thought Decision'}
          </Heading>
        </Box>

        <Box className="rounded-lg dark:bg-gray-800">
          <Text>{verdict.reasoning}</Text>
        </Box>

        <VStack space="md" className="py-8">
          <Heading size="lg">What should you do?</Heading>
          {verdict.advice.map((advice, index) => (
            <Box
              key={index}
              className="flex-row items-start rounded-lg border border-gray-200 bg-white p-4 dark:bg-gray-800">
              <Text className="mr-2 text-lg font-bold">{index + 1}.</Text>
              <Text className="flex-1 text-sm">{advice}</Text>
            </Box>
          ))}
        </VStack>

        <Button size="xl" className="mt-8 w-full" onPress={onRestart}>
          <ButtonText className="w-full text-center">Start Over</ButtonText>
        </Button>
      </VStack>
    </ScrollView>
  );
}
