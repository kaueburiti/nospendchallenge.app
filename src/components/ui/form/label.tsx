import React from 'react';
import { Text } from '@/components/ui';

interface FormInputLabelProps {
  label: string;
}

export const FormInputLabel: React.FC<FormInputLabelProps> = ({ label }) => {
  return (
    <Text className="text-md mb-2 font-semibold text-typography-600">
      {label}
    </Text>
  );
};

export default FormInputLabel;
