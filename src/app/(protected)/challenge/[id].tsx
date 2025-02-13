import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Button, Text, VStack } from '@/components/ui';
import { useLocalSearchParams, router } from 'expo-router';
import { useChallenge } from '@/hooks/challenges';
import { format, differenceInDays } from 'date-fns';

export default function ChallengeDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);

  if (isLoading) {
    return (
      <SafeAreaView>
        <Box className="p-4">
          <Text>Loading...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (!challenge) {
    return (
      <SafeAreaView>
        <Box className="p-4">
          <Text>Challenge not found</Text>
        </Box>
      </SafeAreaView>
    );
  }

  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  const totalDays = differenceInDays(endDate, startDate);
  const daysElapsed = differenceInDays(new Date(), startDate);
  const progress = Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);

  return (
    <SafeAreaView>
      <Box className="p-4">
        <Button onPress={() => router.back()} className="mb-4">
          <Text>Back</Text>
        </Button>

        <VStack space="md">
          <Text className="text-2xl font-bold">{challenge.title}</Text>

          <Box className="mt-4">
            <Text className="mb-2 text-lg">Progress</Text>

            <Text className="mt-2">
              {Math.round(progress)}% Complete ({daysElapsed}/{totalDays} days)
            </Text>
          </Box>

          <Box className="mt-4">
            <Text className="mb-2 text-lg">Duration</Text>
            <Text>
              {format(startDate, 'PPP')} - {format(endDate, 'PPP')}
            </Text>
          </Box>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}
