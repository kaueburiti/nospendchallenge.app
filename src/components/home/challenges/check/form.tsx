import React, { useState } from 'react';
import { Box, Button, ButtonText, VStack } from '@/components/ui';
import { format } from 'date-fns';
import { useCreateCheck } from '@/hooks/checks';
import FormInput from '@/components/ui/form/input';
import { useForm } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FormInputLabel } from '@/components/ui/form/label';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { useCaptureEvent } from '@/hooks/analytics/useCaptureEvent';
import { useSession } from '@/hooks/useSession';

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
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      message: '',
    },
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [date, setDate] = useState(new Date());
  const { captureEvent } = useCaptureEvent();

  const { mutate: createCheck, isPending } = useCreateCheck(
    Number(challengeId),
    {
      onSuccess: () => {
        closeModal();
      },
      onError: (error: Error) => {
        if (
          error.message.includes(
            'duplicate key value violates unique constraint',
          )
        ) {
          setErrorMessage('You already checked in this day');
        } else {
          setErrorMessage('Failed to create check in, please try again later');
        }
      },
    },
  );

  const onSubmit = async (data: { message: string }) => {
    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);

    createCheck({
      challenge_id: Number(challengeId),
      date: formattedDate.toString(),
      message: data.message,
    });

    captureEvent('CHECK_IN_CREATED', {
      challengeId,
      date: formattedDate,
      message: data.message,
    });
  };

  return (
    <VStack space="xl">
      <VStack space="lg">
        {errorMessage && (
          <Box className="flex-col">
            <Text className="text-sm font-semibold text-red-500">
              {errorMessage}
            </Text>
          </Box>
        )}
        <Box className="flex-col">
          <FormInputLabel label={t('checks.form.date.label')} />
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
          placeholder={t('checks.form.message.placeholder')}
          label={t('checks.form.message.label')}
        />
      </VStack>
      <Box className="mt-4 flex-row justify-between gap-6">
        <Button
          variant="outline"
          action="secondary"
          onPress={onClose}
          className="flex-1">
          <ButtonText>{t('checks.form.cancel_button')}</ButtonText>
        </Button>
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          className="flex-1">
          <ButtonText>
            {isPending
              ? t('checks.form.saving_button')
              : t('checks.form.save_button')}
          </ButtonText>
        </Button>
      </Box>
    </VStack>
  );
};
