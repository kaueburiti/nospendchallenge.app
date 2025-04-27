import React, { useState } from 'react';
import { Box, Button, ButtonText, VStack, HStack } from '@/components/ui';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm } from 'react-hook-form';
import FormInput from '@/components/ui/form/input';
import { FormInputLabel } from '@/components/ui/form/label';
import { CurrencyInput } from '@/components/ui/form/currency-input';
import { Trash } from 'lucide-react-native';

export interface CheckItem {
  title: string;
  price: number;
}

interface ItemFormProps {
  items: CheckItem[];
  onAddItem: (item: CheckItem) => void;
  onRemoveItem: (index: number) => void;
}

interface ItemFormValues {
  title: string;
  price: string; // Price as string for the form
}

export const CheckItemForm = ({
  items,
  onAddItem,
  onRemoveItem,
}: ItemFormProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<ItemFormValues>({
    defaultValues: {
      title: '',
      price: '',
    },
  });
  const [error, setError] = useState('');

  const onSubmit = (data: ItemFormValues) => {
    // Validate input
    if (!data.title.trim()) {
      setError(
        t('checks.form.item.error.title_required') || 'Item name is required',
      );
      return;
    }

    // Convert price from string to number
    const priceValue = data.price
      ? parseFloat(data.price.replace(/[^0-9.]/g, ''))
      : 0;

    if (priceValue <= 0) {
      setError(
        t('checks.form.item.error.price_required') ||
          'Price must be greater than 0',
      );
      return;
    }

    // Clear error and add item
    setError('');
    onAddItem({
      title: data.title.trim(),
      price: priceValue,
    });
    reset(); // Reset form for the next item
  };

  return (
    <VStack space="md">
      <Text className="text-lg font-semibold">
        {t('checks.form.items.label') || 'Items Purchased'}
      </Text>

      {/* Form for adding new items */}
      <HStack space="sm" className="items-end">
        <Box className="flex-1">
          <FormInputLabel label={t('checks.form.item.title') || 'Item Name'} />
          <FormInput
            control={control}
            name="title"
            placeholder={
              t('checks.form.item.title_placeholder') || 'What did you buy?'
            }
          />
        </Box>

        <Box className="w-1/3">
          <FormInputLabel label={t('checks.form.item.price') || 'Price'} />
          <CurrencyInput
            control={control}
            name="price"
            placeholder={t('checks.form.item.price_placeholder') || 'Price'}
          />
        </Box>

        <Button onPress={handleSubmit(onSubmit)} className="mb-[2px]">
          <ButtonText>{t('checks.form.item.add') || 'Add'}</ButtonText>
        </Button>
      </HStack>

      {error && <Text className="text-sm text-red-500">{error}</Text>}

      {/* List of added items */}
      {items.length > 0 && (
        <VStack space="xs" className="mt-2">
          <Text className="text-sm font-medium">
            {t('checks.form.items.added') || 'Added Items'}
          </Text>

          {items.map((item, index) => (
            <HStack
              key={index}
              className="items-center justify-between rounded-md bg-gray-100 px-3 py-2 dark:bg-gray-800">
              <Text className="flex-1">{item.title}</Text>
              <Text className="mr-2">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(item.price)}
              </Text>
              <Button
                variant="link"
                onPress={() => onRemoveItem(index)}
                className="p-0">
                <ButtonText>
                  <Trash color="red" size={16} />
                </ButtonText>
              </Button>
            </HStack>
          ))}

          <HStack className="justify-between pt-2">
            <Text className="font-bold">
              {t('checks.form.items.total') || 'Total'}
            </Text>
            <Text className="font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(items.reduce((sum, item) => sum + item.price, 0))}
            </Text>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};
