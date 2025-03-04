import React, { useState } from 'react';
import { Box, Button, ButtonText, VStack } from '@/components/ui';
import { format } from 'date-fns';
import { useCreateCheck } from '@/hooks/checks';
import FormInput from '@/components/ui/form/input';
import { useForm } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FormInputLabel } from '@/components/ui/form/label';

type CheckInFormProps = {
  challengeId: string;
  onSubmit: () => void;
  onClose: () => void;
};

export const CheckInForm = ({
  challengeId,
  onSubmit: closeModal,
  onClose,
}: CheckInFormProps) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      message: '',
    },
  });
  const [date, setDate] = useState(new Date());
  const { mutate: createCheck, isPending } = useCreateCheck(
    Number(challengeId),
  );

  const onSubmit = async (data: { message: string }) => {
    createCheck({
      challenge_id: Number(challengeId),
      date: format(date, 'yyyy-MM-dd'),
      message: data.message,
    });
    closeModal();
  };

  return (
    <VStack space="xl">
      <VStack space="lg">
        <Box className="flex-col">
          <FormInputLabel label="Check In Date:" />
          <Box className="-ml-4">
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={'date'}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          </Box>
        </Box>

        <FormInput
          control={control}
          name="message"
          placeholder="How was it?"
          label="Tell us how are you feeling today"
        />
      </VStack>
      <Box className="mt-4 flex-row justify-between">
        <Button variant="outline" action="secondary" onPress={onClose}>
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button onPress={handleSubmit(onSubmit)} disabled={isPending}>
          <ButtonText>
            {isPending ? 'Creating...' : 'Create Check In'}
          </ButtonText>
        </Button>
      </Box>
    </VStack>
  );
};
