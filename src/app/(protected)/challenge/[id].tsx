import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Box, Button, Text, VStack } from '@/components/ui';
import { useLocalSearchParams, router } from 'expo-router';
import { useChallenge } from '@/hooks/challenges';
import { format, differenceInDays } from 'date-fns';
import { useCreateCheck, useGetUserChecksByChallenge } from '@/hooks/checks';

export default function ChallengeDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);
  const { mutate: createCheck } = useCreateCheck();
  const { data: checks } = useGetUserChecksByChallenge(Number(id));
  const date = format(new Date(), 'yyyy-MM-dd');

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
  const daysChecked = checks?.length ?? 0;
  const progress = Math.min(Math.max((daysChecked / totalDays) * 100, 0), 100);

  const handleCreateCheck = () => {
    createCheck({
      challenge_id: Number(id),
      date: date,
    });
  };

  console.log('Challenge ID', id);

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
              {Math.round(progress)}% Complete ({daysChecked}/{totalDays} days)
            </Text>
          </Box>

          <Box className="mt-4">
            <Text className="mb-2 text-lg">Duration</Text>
            <Text>
              {format(startDate, 'PPP')} - {format(endDate, 'PPP')}
            </Text>
          </Box>

          <Box className="mt-4">
            <Text className="mb-2 text-lg">Add Check to {date}</Text>

            <Button onPress={handleCreateCheck}>
              <Text>Add Check</Text>
            </Button>
          </Box>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}
