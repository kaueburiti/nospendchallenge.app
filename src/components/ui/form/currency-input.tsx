import React from 'react';
import { Box, Input, InputField } from '@/components/ui';
import { Control, Controller } from 'react-hook-form';

interface CurrencyInputProps {
  control: Control<any>;
  name: string;
  placeholder?: string;
  defaultValue?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  control,
  name,
  placeholder,
  defaultValue,
}) => {
  const formatCurrency = (value: string): string => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }

    // Format with $ prefix if there's a value
    if (numericValue) {
      return `$${numericValue}`;
    }

    return '';
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input>
          <InputField
            placeholder={placeholder || '$0.00'}
            value={value}
            onChangeText={text => {
              // If the user is deleting the $ sign, don't replace it immediately
              if (text === '') {
                onChange('');
              } else {
                onChange(formatCurrency(text));
              }
            }}
            onBlur={onBlur}
            keyboardType="decimal-pad"
          />
        </Input>
      )}
    />
  );
};
