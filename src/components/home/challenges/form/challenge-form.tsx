import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VStack, HStack } from '@/components/ui';
import { Button, ButtonText } from '@/components/ui';
import FormInput from '@/components/ui/form/input';
import {
  challengeSchema,
  type ChallengeSchemaType,
} from '@/lib/schema/challenge';
import { useTranslation } from '@/hooks/useTranslation';
import DateTimePicker from '@react-native-community/datetimepicker';

interface ChallengeFormProps {
  onSubmit: (data: ChallengeSchemaType) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<ChallengeSchemaType>;
}

export default function ChallengeForm({
  onSubmit,
  isLoading,
  defaultValues,
}: ChallengeFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ChallengeSchemaType>({
    resolver: zodResolver(challengeSchema),
    defaultValues,
  });

  const [showStartDate, setShowStartDate] = React.useState(false);
  const [showEndDate, setShowEndDate] = React.useState(false);

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const type = watch('type');

  return (
    <VStack className="flex-1 gap-4">
      <FormInput
        control={control}
        name="name"
        label={t('challenge.name_placeholder')}
        placeholder={t('challenge.name_placeholder')}
        errorMessage={errors.name?.message ? t(errors.name.message) : undefined}
      />

      <FormInput
        control={control}
        name="description"
        label={t('challenge.description_placeholder')}
        placeholder={t('challenge.description_placeholder')}
        errorMessage={
          errors.description?.message
            ? t(errors.description.message)
            : undefined
        }
      />

      <FormInput
        control={control}
        name="amount"
        label={t('challenge.amount_placeholder')}
        placeholder={t('challenge.amount_placeholder')}
        errorMessage={
          errors.amount?.message ? t(errors.amount.message) : undefined
        }
      />

      <VStack space="sm">
        <ButtonText className="text-sm font-medium text-gray-700">
          {t('challenge.type_placeholder')}
        </ButtonText>
        <HStack space="sm">
          <Button
            variant={type === 'spending' ? 'solid' : 'outline'}
            size="lg"
            className="flex-1"
            onPress={() => setValue('type', 'spending')}>
            <ButtonText>{t('challenge.type_spending')}</ButtonText>
          </Button>
          <Button
            variant={type === 'saving' ? 'solid' : 'outline'}
            size="lg"
            className="flex-1"
            onPress={() => setValue('type', 'saving')}>
            <ButtonText>{t('challenge.type_saving')}</ButtonText>
          </Button>
        </HStack>
        {errors.type?.message && (
          <ButtonText className="text-sm text-red-500">
            {t(errors.type.message)}
          </ButtonText>
        )}
      </VStack>

      <Button
        variant="outline"
        size="lg"
        onPress={() => setShowStartDate(true)}>
        <ButtonText>
          {startDate
            ? startDate.toLocaleDateString()
            : t('challenge.start_date_placeholder')}
        </ButtonText>
      </Button>

      <Button variant="outline" size="lg" onPress={() => setShowEndDate(true)}>
        <ButtonText>
          {endDate
            ? endDate.toLocaleDateString()
            : t('challenge.end_date_placeholder')}
        </ButtonText>
      </Button>

      {showStartDate && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowStartDate(false);
            if (date) {
              setValue('startDate', date);
            }
          }}
        />
      )}

      {showEndDate && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          onChange={(event, date) => {
            setShowEndDate(false);
            if (date) {
              setValue('endDate', date);
            }
          }}
        />
      )}

      <Button
        variant="solid"
        size="lg"
        className="mt-5 h-12 bg-[#ff7979]"
        onPress={handleSubmit(onSubmit)}
        isDisabled={isLoading}>
        <ButtonText>
          {isLoading ? t('common.save') : t('challenge.create_button')}
        </ButtonText>
      </Button>
    </VStack>
  );
}
