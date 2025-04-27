import React, { useState } from 'react';
import { Box, Button, ButtonText, VStack, HStack } from '@/components/ui';
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
import { CurrencyInput } from '@/components/ui/form/currency-input';
import { CheckStatus } from '@/lib/db/repository/check';

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
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      message: '',
      amount: '',
      status: '' as string,
    },
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [date, setDate] = useState(new Date());
  const { captureEvent } = useCaptureEvent();

  const status = watch('status') as CheckStatus | '';

  const handleStatusChange = (newStatus: CheckStatus) => {
    setValue('status', newStatus);
  };

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
          setErrorMessage(
            t('checks.form.error.duplicate') ||
              'You already checked in this day',
          );
        } else {
          setErrorMessage(
            t('checks.form.error.generic') ||
              'Failed to create check in, please try again later',
          );
        }
      },
    },
  );

  const onSubmit = async (data: {
    message: string;
    amount: string;
    status: string;
  }) => {
    if (!data.status) {
      setErrorMessage(
        t('checks.form.error.status_required') || 'Please select a status',
      );
      return;
    }

    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);

    // Convert amount from string to number
    const amountValue = data.amount
      ? parseFloat(data.amount.replace(/[^0-9.]/g, ''))
      : 0;

    // Set saved_amount or spent_amount based on status
    const checkData = {
      challenge_id: Number(challengeId),
      date: formattedDate.toString(),
      message: data.message,
      status: data.status as CheckStatus,
      saved_amount: data.status === 'success' ? amountValue : 0,
      spent_amount: data.status === 'failure' ? amountValue : 0,
    };

    createCheck(checkData);

    captureEvent('CHECK_IN_CREATED', {
      challengeId,
      date: formattedDate,
      message: data.message,
      status: data.status,
      saved_amount: data.status === 'success' ? amountValue : 0,
      spent_amount: data.status === 'failure' ? amountValue : 0,
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
          <FormInputLabel label={t('checks.form.date.label') || 'Date'} />
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

        <Box className="flex-col">
          <FormInputLabel label={t('checks.form.status.label') || 'Status'} />
          <HStack space="md">
            <Button
              variant={status === 'success' ? 'solid' : 'outline'}
              className={
                status === 'success' ? 'flex-1 bg-green-600' : 'flex-1'
              }
              onPress={() => handleStatusChange('success')}>
              <ButtonText>
                {t('checks.form.status.success') || 'Held Impulse Control'}
              </ButtonText>
            </Button>
            <Button
              variant={status === 'failure' ? 'solid' : 'outline'}
              className={status === 'failure' ? 'flex-1 bg-red-600' : 'flex-1'}
              onPress={() => handleStatusChange('failure')}>
              <ButtonText>
                {t('checks.form.status.failure') || 'Gave in to Impulse'}
              </ButtonText>
            </Button>
          </HStack>
        </Box>

        {status && (
          <>
            <Box className="flex-col">
              <FormInputLabel
                label={
                  status === 'success'
                    ? t('checks.form.saved_amount.label') || 'Saved Amount'
                    : t('checks.form.spent_amount.label') || 'Spent Amount'
                }
              />
              <CurrencyInput
                control={control}
                name="amount"
                placeholder={
                  status === 'success'
                    ? t('checks.form.saved_amount.placeholder') ||
                      'How much did you save?'
                    : t('checks.form.spent_amount.placeholder') ||
                      'How much did you spend?'
                }
              />
            </Box>

            <FormInput
              control={control}
              name="message"
              placeholder={
                t('checks.form.message.placeholder') ||
                'Share your thoughts about today...'
              }
              label={t('checks.form.message.label') || 'Thoughts'}
            />
          </>
        )}
      </VStack>
      <Box className="mt-4 flex-row justify-between gap-6">
        <Button
          variant="outline"
          action="secondary"
          onPress={onClose}
          className="flex-1">
          <ButtonText>{t('checks.form.cancel_button') || 'Cancel'}</ButtonText>
        </Button>
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isPending || !status}
          className="flex-1">
          <ButtonText>
            {isPending
              ? t('checks.form.saving_button') || 'Saving...'
              : t('checks.form.save_button') || 'Save'}
          </ButtonText>
        </Button>
      </Box>
    </VStack>
  );
};
