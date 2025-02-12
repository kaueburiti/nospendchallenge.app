import React, { useState } from 'react';
import { Controller, type Control } from 'react-hook-form';
import { AlertTriangle, EyeIcon, EyeOffIcon } from 'lucide-react-native';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from '@/components/ui';
import { Input, InputField, InputIcon, InputSlot } from '../ui/input';

interface FormInputProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  placeholder: string;
  errorMessage?: string;
  isPassword?: boolean;
  onSubmitEditing?: () => void;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  control,
  placeholder,
  errorMessage,
  isPassword = false,
  onSubmitEditing,
}) => {
  const [isVisible, setIsVisible] = useState(!isPassword);

  const handleToggleVisibility = () => setIsVisible(prev => !prev);

  return (
    <FormControl isInvalid={!!errorMessage} isRequired={true}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field: { onChange, onBlur, value } }) => (
          <Input size={'xl'}>
            <InputField
              className="text-sm"
              placeholder={placeholder}
              value={value as string | undefined}
              onChangeText={onChange}
              onBlur={onBlur}
              onSubmitEditing={onSubmitEditing}
              returnKeyType={onSubmitEditing ? 'done' : 'next'}
              type={isVisible ? 'text' : 'password'}
            />
            {isPassword && (
              <InputSlot onPress={handleToggleVisibility} className="pr-3">
                <InputIcon as={isVisible ? EyeIcon : EyeOffIcon} />
              </InputSlot>
            )}
          </Input>
        )}
      />
      {errorMessage && (
        <FormControlError>
          <FormControlErrorIcon size="sm" as={AlertTriangle} />
          <FormControlErrorText>{errorMessage}</FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};

export default FormInput;
