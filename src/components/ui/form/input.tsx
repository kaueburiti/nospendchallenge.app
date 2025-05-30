import React, { useState } from 'react';
import { Controller, type Control } from 'react-hook-form';
import { AlertTriangle, EyeIcon, EyeOffIcon } from 'lucide-react-native';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from '@/components/ui';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import FormInputLabel from './label';
import CurrencyInput from 'react-native-currency-input';
import { TextInputProps } from 'react-native';

interface FormInputProps {
  name: string;
  label?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  placeholder: string;
  errorMessage?: string;
  isPassword?: boolean;
  isCurrency?: boolean;
  disabled?: boolean;
  onSubmitEditing?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  control,
  placeholder,
  errorMessage,
  disabled = false,
  isPassword = false,
  isCurrency = false,
  autoCapitalize = 'none',
  onSubmitEditing,
}) => {
  const [isVisible, setIsVisible] = useState(!isPassword);

  const handleToggleVisibility = () => setIsVisible(prev => !prev);

  return (
    <FormControl isInvalid={!!errorMessage} isRequired={true}>
      {label && <FormInputLabel label={label} />}
      <Controller
        name={name}
        control={control}
        defaultValue=""
        disabled={disabled}
        render={({ field: { onChange, onBlur, value } }) => {
          if (isCurrency) {
            return (
              <Input size={'xl'} isDisabled={disabled}>
                <CurrencyInput
                  value={value}
                  onChangeValue={onChange}
                  onBlur={onBlur}
                  renderTextInput={(textInputProps: TextInputProps) => (
                    <InputField
                      className="text-sm"
                      placeholder={placeholder}
                      autoCapitalize={autoCapitalize}
                      {...textInputProps}
                    />
                  )}
                  prefix="$"
                  delimiter=","
                  separator="."
                  precision={2}
                />
              </Input>
            );
          }

          return (
            <Input size={'xl'} isDisabled={disabled}>
              <InputField
                className="text-sm"
                placeholder={placeholder}
                value={String(value) as string | undefined}
                onChangeText={onChange}
                onBlur={onBlur}
                onSubmitEditing={onSubmitEditing}
                returnKeyType={onSubmitEditing ? 'done' : 'next'}
                type={isVisible ? 'text' : 'password'}
                autoCapitalize={autoCapitalize}
              />
              {isPassword && (
                <InputSlot onPress={handleToggleVisibility} className="pr-3">
                  <InputIcon as={isVisible ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              )}
            </Input>
          );
        }}
      />
      {errorMessage && (
        <FormControlError>
          <FormControlErrorText size="sm">{errorMessage}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};

export default FormInput;
