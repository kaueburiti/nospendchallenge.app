import React from 'react';
import { Box, Text } from '@/components/ui';
import { useLocalSearchParams } from 'expo-router';
import { useChallenge } from '@/hooks/challenges';
import { differenceInDays } from 'date-fns';
import classNames from 'classnames';

export default function DaysGrid() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);

  if (isLoading) {
    return null;
  }

  const numberOfDays = challenge
    ? differenceInDays(
        new Date(challenge.end_date),
        new Date(challenge.start_date),
      )
    : 0;

  return (
    <Box className="mx-auto flex w-[336px] flex-row flex-wrap justify-start gap-2">
      {Array.from({ length: numberOfDays }, (_, index) => index + 1).map(
        day => (
          <Day key={day} day={day} />
        ),
      )}
    </Box>
  );
}

const Day = ({ day }: { day: number }) => {
  return (
    <Box
      className={classNames(
        'h-12 w-12 items-center justify-center rounded-md bg-gray-300',
      )}>
      <Text className="text-md font-bold text-white">{day}</Text>
    </Box>
  );
};
