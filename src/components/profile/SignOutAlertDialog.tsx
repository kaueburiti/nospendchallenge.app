import React from 'react';
import {
  Text,
  Heading,
  Button,
  ButtonText,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from '../ui';
import { XIcon } from 'lucide-react-native';
import { useSignOut } from '@/hooks/auth/useSignOut';
import { Icon } from '@/components/ui/icon';
import { useTranslation } from '@/hooks/useTranslation';

interface SignOutAlertDialogProps {
  showAlertDialog: boolean;
  setShowAlertDialog: (show: boolean) => void;
}

export default function SignOutAlertDialog({
  showAlertDialog,
  setShowAlertDialog,
}: SignOutAlertDialogProps) {
  const { t } = useTranslation();
  const { signOut } = useSignOut();

  const handleSignOut = () => {
    signOut({});
    setShowAlertDialog(false);
  };

  return (
    <AlertDialog
      isOpen={showAlertDialog}
      onClose={() => {
        setShowAlertDialog(false);
      }}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="p-4">
        <AlertDialogHeader>
          <AlertDialogCloseButton>
            <Icon as={XIcon} />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody className="" contentContainerClassName="">
          <Text className="mb-6">{t('auth.confirmation.sign_out')}</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={() => {
              setShowAlertDialog(false);
            }}>
            <ButtonText>{t('common.cancel')}</ButtonText>
          </Button>
          <Button action="negative" onPress={handleSignOut}>
            <ButtonText className="text-white">
              {t('auth.actions.sign_out')}
            </ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
