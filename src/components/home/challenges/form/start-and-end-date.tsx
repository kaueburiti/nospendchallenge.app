import React from 'react';
import { Box, Text } from '@/components/ui';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormInputLabel from '@/components/ui/form/label';

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
      <Box>
        <FormInputLabel label="Start Date" />
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
      <Box>
        <FormInputLabel label="End Date" />
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
