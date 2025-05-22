import React, { useState } from 'react';
import { VStack, Box } from '@/components/ui';
import { Heading } from '@/components/ui';
import { Button, ButtonText } from '@/components/ui';
import { MenuItem } from '@/components/MenuItem';
import { LifeBuoyIcon, OctagonX, CreditCard } from 'lucide-react-native';
import { ProfileCard } from '@/components/profile/ProfileCard';
import DeleteAccountAlertDialog from '../../../components/profile/DeleteAccountAlertDialog';
import { useSession } from '@/hooks/useSession';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from '@/hooks/useTranslation';
import { router } from 'expo-router';
import { useSignOut } from '@/hooks/auth/useSignOut';
import PageSafeAreaView from '@/components/layout/page-safe-area-view';
import { Section } from '@/components/Section';
interface ProfileSettingsProps {
  onOpenDeleteAccountDialog: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  onOpenDeleteAccountDialog,
}) => {
  const { t } = useTranslation();

  return (
    <VStack space="lg">
      <Heading>{t('profile.settings_title')}</Heading>

      <VStack space="lg">
        <MenuItem
          icon={CreditCard}
          text={t('profile.billing_title')}
          onPress={() => router.push('/billing')}
        />
        <MenuItem
          icon={OctagonX}
          onPress={onOpenDeleteAccountDialog}
          text={t('profile.delete_account.title')}
        />
      </VStack>
    </VStack>
  );
};

const ProfileSupport: React.FC = () => {
  const { t } = useTranslation();
  return (
    <VStack space="lg">
      <Heading>{t('profile.support_title')}</Heading>
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
    <Button variant="outline" onPress={onClick}>
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
        <Section className="h-full flex-1">
          <VStack space="4xl" className="h-full flex-1">
            <ProfileCard user={session?.user ?? null} />

            <VStack space="4xl">
              <ProfileSettings
                onOpenDeleteAccountDialog={onOpenDeleteAccountDialog}
              />
              <ProfileSupport />
            </VStack>
            <Box className="mt-12">
              <SignOutButton onClick={() => signOut({})} />
            </Box>
          </VStack>
          <DeleteAccountAlertDialog
            openDeleteAccountDialog={showDeleteAccountDialog}
            onCloseDeleteAccountDialog={() => setShowDeleteAccountDialog(false)}
          />
        </Section>
      </GestureHandlerRootView>
    </PageSafeAreaView>
  );
};

export default ProfilePage;
