import React from 'react';
import { Box, Text } from '@/components/ui';
import { useLocalSearchParams } from 'expo-router';
import { useChallenge } from '@/hooks/challenges';
import { addDays, differenceInDays, format } from 'date-fns';
import classNames from 'classnames';
import { useGetUserChecksByChallenge } from '@/hooks/checks';
export default function DaysGrid() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: challenge, isLoading } = useChallenge(id);
  const { data: checks } = useGetUserChecksByChallenge(Number(id));

  if (isLoading || !challenge) {
    return null;
  }

  const allDaysBetweenDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];
    // The +1 is needed because differenceInDays returns the number of days between dates,
    // but we want to include both the start and end dates in our grid.
    // For example: Jan 1 to Jan 3 is 2 days difference, but we want to show 3 days (1st, 2nd, and 3rd)
    const totalDays = differenceInDays(end, start) + 1;

    for (let i = 0; i < totalDays; i++) {
      const date = addDays(start, i);
      days.push(format(date, 'yyyy-MM-dd'));
    }
    return days;
  };

  const days = allDaysBetweenDates(challenge?.start_date, challenge?.end_date); // BUG: This is adding one day more than the end date

  return (
    <Box className="mx-auto flex w-[336px] flex-row flex-wrap justify-start gap-2">
      {days.map((day, index) => (
        <Day
          key={day}
          dayPosition={index}
          isChecked={checks?.some(check => check.date === day) ?? false}
        />
      ))}
    </Box>
  );
}

const Day = ({
  isChecked,
  dayPosition,
}: {
  dayPosition: number;
  isChecked: boolean;
}) => {
  return (
    <Box
      className={classNames(
        'h-12 w-12 items-center justify-center rounded-md bg-gray-300',
        {
          'bg-success-500': isChecked,
        },
      )}>
      <Text className="text-md font-bold text-white">{dayPosition + 1}</Text>
    </Box>
  );
};
