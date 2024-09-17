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
import {Icon} from "@/components/ui/icon";

const DeleteAccountAlertDialog = ({
  openDeleteAccountDialog,
  onCloseDeleteAccountDialog,
}: {
  openDeleteAccountDialog: boolean;
  onCloseDeleteAccountDialog: () => void;
}) => {
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
          <Heading>Delete Account</Heading>
          <AlertDialogCloseButton>
            <Icon as={XIcon} />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody className="" contentContainerClassName="">
          <Text className="mb-6">
            Are you sure you want to delete your account? This action cannot be
            undone.
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={onCloseDeleteAccountDialog}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button action="negative" onPress={handleDeleteAccount}>
            <ButtonText className="text-white">Delete Account</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountAlertDialog;
