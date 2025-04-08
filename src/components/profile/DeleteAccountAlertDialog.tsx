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
import { useDeleteAccount } from '@/hooks/auth/useDeleteAccount';
import { Icon } from '@/components/ui/icon';
import { useTranslation } from '@/hooks/useTranslation';
const DeleteAccountAlertDialog = ({
  openDeleteAccountDialog,
  onCloseDeleteAccountDialog,
}: {
  openDeleteAccountDialog: boolean;
  onCloseDeleteAccountDialog: () => void;
}) => {
  const { t } = useTranslation();
  const { deleteAccount } = useDeleteAccount();

  const handleDeleteAccount = async () => {
    await deleteAccount({});
  };

  return (
    <AlertDialog
      isOpen={openDeleteAccountDialog}
      onClose={onCloseDeleteAccountDialog}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="p-4">
        <AlertDialogHeader>
          <Heading>{t('profile.delete_account.title')}</Heading>
          <AlertDialogCloseButton>
            <Icon as={XIcon} />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody className="" contentContainerClassName="">
          <Text className="mb-6">
            {t('profile.delete_account.description')}
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={onCloseDeleteAccountDialog}>
            <ButtonText>{t('profile.delete_account.cancel_button')}</ButtonText>
          </Button>
          <Button action="negative" onPress={handleDeleteAccount}>
            <ButtonText className="text-white">
              {t('profile.delete_account.delete_button')}
            </ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountAlertDialog;
