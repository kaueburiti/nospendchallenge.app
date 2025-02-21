import React from 'react';
import { Box, Text } from '@/components/ui';
import DateTimePicker from '@react-native-community/datetimepicker';

type DatePickerFieldProps = {
  date: Date;
  disabled?: boolean;
  onChange?: (date: Date) => void;
};

type StartAndEndDatesProps = {
  start: DatePickerFieldProps;
  end: DatePickerFieldProps;
};

export function StartAndEndDates({ start, end }: StartAndEndDatesProps) {
  return (
    <Box className="flex-row gap-6">
      <Box className="mb-4">
        <Text className="mb-2">Start Date</Text>
        <Box className="-ml-3">
          <DateTimePicker
            disabled={start.disabled}
            value={start.date}
            mode="date"
            minimumDate={start.date}
            onChange={(_, date) => {
              if (date) {
                start.onChange?.(date);
              }
            }}
          />
        </Box>
      </Box>
      <Box className="mb-4">
        <Text className="mb-2">End Date</Text>
        <Box className="-ml-3">
          <DateTimePicker
            value={end.date}
            mode="date"
            minimumDate={start.date}
            onChange={(_, date) => {
              if (date) {
                end.onChange?.(date);
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
