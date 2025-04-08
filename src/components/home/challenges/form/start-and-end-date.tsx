import React from 'react';
import { Box } from '@/components/ui';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormInputLabel from '@/components/ui/form/label';
import { useTranslation } from '@/hooks/useTranslation';
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
  const { t } = useTranslation();
  return (
    <Box className="flex-row gap-6">
      <Box>
        <FormInputLabel label={t('challenge.form.start_date.label')} />
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
        <FormInputLabel label={t('challenge.form.end_date.label')} />
        <Box className="-ml-3">
          <DateTimePicker
            value={end.date}
            mode="date"
            minimumDate={
              new Date(start.date.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days from start date
            }
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
