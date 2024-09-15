import React from 'react';
import {
  Text,
  Heading,
  Icon,
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

const SignOutAlertDialog = ({
  openSignOutAlertDialog,
  onCloseSignOutAlertDialog,
}: {
  openSignOutAlertDialog: boolean;
  onCloseSignOutAlertDialog: () => void;
}) => {
  const { signOut } = useSignOut();

  const handleSignOut = async () => {
    await signOut({});
    onCloseSignOutAlertDialog();
  };

  return (
    <AlertDialog
      isOpen={openSignOutAlertDialog}
      onClose={onCloseSignOutAlertDialog}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="p-4">
        <AlertDialogHeader>
          <Heading>Logout</Heading>
          <AlertDialogCloseButton>
            <Icon as={XIcon} />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody className="" contentContainerClassName="">
          <Text className="mb-6">Are you sure, you want to sign out?</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={onCloseSignOutAlertDialog}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button action="negative" onPress={handleSignOut}>
            <ButtonText className="text-white">Sign Out</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SignOutAlertDialog;
