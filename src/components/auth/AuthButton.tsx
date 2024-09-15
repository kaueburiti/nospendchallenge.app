// AuthButton.tsx
import React from 'react';
import { Button, ButtonIcon, ButtonText } from '../ui/button';
import { AppleIcon, GoogleIcon } from '@/assets/icons/Social';

interface AuthButtonProps {
  provider: 'Google' | 'Apple';
  onPress: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ provider, onPress }) => {
  const isGoogle = provider === 'Google';
  return (
    <Button
      action="secondary"
      variant="outline"
      className="gap-4 h-12 mt-4"
      onPress={onPress}>
      <ButtonIcon className="bg-amber-200" as={isGoogle ? GoogleIcon : AppleIcon} />
      <ButtonText>{`Sign in with ${provider}`}</ButtonText>
    </Button>
  );
};

export default AuthButton;
