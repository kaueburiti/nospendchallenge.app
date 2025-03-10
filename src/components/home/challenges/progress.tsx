import React from 'react';
import { Box, HStack, VStack, Text } from '@/components/ui';
import { ProgressFilledTrack } from '@/components/ui/progress';
import { Progress } from '@/components/ui/progress';
import { differenceInDays, format } from 'date-fns';
import type { Tables } from '@/lib/db/database.types';
export default function ChallengeProgressBar({
  challenge,
  showDates = false,
}: {
  challenge: Tables<'challenges'>;
  showDates?: boolean;
}) {
  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  const today = new Date();
  const daysPassed = differenceInDays(today, startDate) + 1;
  const percentage = Math.max(
    5,
    (daysPassed / differenceInDays(endDate, startDate)) * 100,
  );

  return (
    <VStack className="justify-between gap-1">
      {showDates && (
        <HStack className="justify-between">
          <Text className="text-xs font-bold">
            {format(new Date(challenge.start_date), 'MMM d, yyyy')}
          </Text>
          <Text className="text-xs font-bold">
            {format(new Date(challenge.end_date), 'MMM d, yyyy')}
          </Text>
        </HStack>
      )}
      <Box className="w-full">
        <Progress
          value={percentage}
          size="2xl"
          orientation="horizontal"
          className="w-full rounded-md">
          <ProgressFilledTrack />
        </Progress>
      </Box>
    </VStack>
  );
}

/*

📆 Date calculations
FIX: The calculation for skipped days is not working correctly.

⭐ Feature requests
FEATURE: Allow inviting friends to join a challenge.
FEATURE: Create the activity automattic log
FEATURE: Create challenges suggestions
FEATURE: Add the rules field to the challenge
FEATURE: Create a chat inside the challenge

BUG: The challenge invitations policies has to be disabled in order to invite friends to join a challenge
BUG: The challenge participants policies has to be disabled in order to invite friends to join a challenge
BUG: Update profile input glitch, you have to make the profile bucket public in order to see the profile picture
BUG: You should be able to create checks to challenges that you're participating in

*/
