import React, { useContext, useState } from 'react';
import { HStack, VStack } from '@/components/ui';
import { Heading } from '@/components/ui';
import { Divider } from '@/components/ui';
import { Button, ButtonText } from '@/components/ui';
import { MenuItem } from '@/components/MenuItem';
import { LifeBuoyIcon, OctagonX, CreditCard } from 'lucide-react-native';
import { ProfileCard } from '@/components/profile/ProfileCard';
import DeleteAccountAlertDialog from '../../../components/profile/DeleteAccountAlertDialog';
import { useSession } from '@/hooks/useSession';
import {
  ScrollView,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useTranslation } from '@/hooks/useTranslation';
import { router } from 'expo-router';
import { useSignOut } from '@/hooks/auth/useSignOut';
import { RevenueCatContext } from '@/provider/RevenueCatProvider';
import PageSafeAreaView from '@/components/layout/page-safe-area-view';
interface ProfileSettingsProps {
  onOpenDeleteAccountDialog: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  onOpenDeleteAccountDialog,
}) => {
  const { t } = useTranslation();
  const { customerInfo } = useContext(RevenueCatContext);
  const isPro = !!customerInfo?.activeSubscriptions?.length;

  return (
    <VStack space="lg">
      <Heading className="mb-1">{t('profile.settings_title')}</Heading>
      {isPro && (
        <MenuItem
          icon={CreditCard}
          text={t('profile.billing_title')}
          onPress={() => router.push('/billing')}
        />
      )}
      <MenuItem
        icon={OctagonX}
        onPress={onOpenDeleteAccountDialog}
        text={t('profile.delete_account.title')}
      />
    </VStack>
  );
};

const ProfileSupport: React.FC = () => {
  const { t } = useTranslation();
  return (
    <VStack space="lg">
      <Heading className="mb-1">{t('profile.support_title')}</Heading>
      <MenuItem
        onPress={() => router.push('/privacy-policy')}
        icon={LifeBuoyIcon}
        text={t('profile.terms_of_service')}
      />
    </VStack>
  );
};

interface SignOutButtonProps {
  onClick: () => void;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <Button variant="outline" className="mt-auto" onPress={onClick}>
      <ButtonText>{t('profile.sign_out')}</ButtonText>
    </Button>
  );
};

const ProfilePage = () => {
  const { session } = useSession();
  const { signOut } = useSignOut();
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);

  const onOpenDeleteAccountDialog = () => setShowDeleteAccountDialog(true);

  return (
    <PageSafeAreaView>
      <GestureHandlerRootView>
        <ScrollView className="flex flex-1">
          <VStack className="flex-1 px-5" space="lg">
            <HStack className="flex-1 items-center justify-between">
              <ProfileCard user={session?.user ?? null} />
            </HStack>

            <ProfileSettings
              onOpenDeleteAccountDialog={onOpenDeleteAccountDialog}
            />
            <ProfileSupport />
            <Divider className="my-2" />
            <SignOutButton onClick={() => signOut({})} />
          </VStack>
          <DeleteAccountAlertDialog
            openDeleteAccountDialog={showDeleteAccountDialog}
            onCloseDeleteAccountDialog={() => setShowDeleteAccountDialog(false)}
          />
        </ScrollView>
      </GestureHandlerRootView>
    </PageSafeAreaView>
  );
};

export default ProfilePage;
