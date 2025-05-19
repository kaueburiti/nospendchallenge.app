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
  const iconColor = verdict.isImpulsive ? 'text-red-500' : 'text-green-500';

  return (
    <ScrollView className="flex-1">
      <VStack space="xl" className="flex-1 p-4">
        <Box className="items-center">
          <Icon size={64} className={iconColor} />
          <Heading size="2xl" className="mt-4 text-center">
            {verdict.isImpulsive
              ? 'Impulsive Purchase'
              : 'Well-Thought Decision'}
          </Heading>
        </Box>

        <Box className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <Text className="text-lg">{verdict.reasoning}</Text>
        </Box>

        <VStack space="md">
          <Heading size="lg">Advice</Heading>
          {verdict.advice.map((advice, index) => (
            <Box
              key={index}
              className="flex-row items-start rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <Text className="mr-2 text-lg font-bold">{index + 1}.</Text>
              <Text className="flex-1 text-lg">{advice}</Text>
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
