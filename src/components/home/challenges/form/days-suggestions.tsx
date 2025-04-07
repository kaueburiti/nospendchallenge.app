import React from 'react';
import { Box, Text } from '@/components/ui';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Pressable } from 'react-native';
import { Badge } from '@/components/ui/badge';
import classNames from 'classnames';
import { type ChallengeSchemaType } from '@/lib/schema/challenge';

interface DaysSuggestionsProps {
  watch: UseFormWatch<ChallengeSchemaType>;
  setValue: UseFormSetValue<ChallengeSchemaType>;
}

export function DaysSuggestions({ watch, setValue }: DaysSuggestionsProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<number>(0);

  return (
    <Box>
      <Text className="mb-2 text-sm">Some suggestions:</Text>
      <Box className="flex-row gap-4">
        {[30, 60, 90, 120].map(period => (
          <Pressable
            key={period}
            onPress={() => {
              const startDate = watch('startDate');
              const endDate = new Date(startDate);
              // The -1 is needed because we want to include both the start and end dates in our grid.
              // For example: Jan 1 to Jan 3 is 2 days difference, but we want to show 3 days (1st, 2nd, and 3rd)
              // So we need to subtract 1 from the period to get the correct number of days.
              endDate.setDate(startDate.getDate() + (period - 1));

              setSelectedPeriod(period);
              setValue('endDate', endDate);
            }}>
            <Badge
              size="sm"
              variant="outline"
              className="rounded-lg"
              action={selectedPeriod === period ? 'primary' : 'muted'}>
              <Text
                className={classNames(
                  'text-sm',
                  selectedPeriod === period && 'text-white',
                )}>
                {period} Days
              </Text>
            </Badge>
          </Pressable>
        ))}
      </Box>
    </Box>
  );
}
