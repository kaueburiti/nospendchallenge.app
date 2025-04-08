import React, { useContext, useState } from 'react';
import { VStack } from '@/components/ui';
import { Heading } from '@/components/ui';
import { Divider } from '@/components/ui';
import { Button, ButtonText } from '@/components/ui';
import { MenuItem } from '@/components/MenuItem';
import { LifeBuoyIcon, OctagonX, Lock } from 'lucide-react-native';
import { ProfileCard } from '@/components/profile/ProfileCard';
import SignOutAlertDialog from '../../../components/profile/SignOutAlertDialog';
import DeleteAccountAlertDialog from '../../../components/profile/DeleteAccountAlertDialog';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { useSession } from '@/hooks/useSession';
import { RevenueCatContext } from '@/provider/RevenueCatProvider';
import Paywall from '../../../components/payment/paywall';
import {
  ScrollView,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { PaymentPlan } from '@/components/profile/PaymentPlan';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import ChangePasswordDrawer from '@/components/profile/ChangePasswordDrawer';
import { router } from 'expo-router';

interface ProfileSettingsProps {
  onOpenDeleteAccountDialog: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  onOpenDeleteAccountDialog,
}) => {
  const { t } = useTranslation();
  return (
    <VStack space="lg">
      <Heading className="mb-1">{t('profile.settings_title')}</Heading>
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
  onOpenSignOutAlertDialog: () => void;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({
  onOpenSignOutAlertDialog,
}) => {
  const { t } = useTranslation();
  return (
    <Button
      variant="outline"
      className="mt-auto"
      onPress={onOpenSignOutAlertDialog}>
      <ButtonText>{t('profile.sign_out')}</ButtonText>
    </Button>
  );
};

interface ProfileSecurityProps {
  onOpenChangePasswordDrawer: () => void;
}

const ProfileSecurity: React.FC<ProfileSecurityProps> = ({
  onOpenChangePasswordDrawer,
}) => {
  const { t } = useTranslation();
  return (
    <VStack space="lg">
      <MenuItem
        icon={Lock}
        onPress={onOpenChangePasswordDrawer}
        text={t('profile.change_password')}
      />
    </VStack>
  );
};

const ProfilePage = () => {
  const { t } = useTranslation();
  const [showPaywall, setShowPaywall] = useState(false);
  const { session } = useSession();
  const { isDark, toggleColorMode } = useTheme();
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const [showSignOutAlertDialog, setShowSignOutAlertDialog] = useState(false);
  const [showChangePasswordDrawer, setShowChangePasswordDrawer] =
    useState(false);

  const onOpenDeleteAccountDialog = () => setShowDeleteAccountDialog(true);
  const onOpenSignOutAlertDialog = () => setShowSignOutAlertDialog(true);
  const onOpenChangePasswordDrawer = () => setShowChangePasswordDrawer(true);

  const { customerInfo } = useContext(RevenueCatContext);
  const activeEntitlements = customerInfo?.activeSubscriptions;

  return (
    <>
      {showPaywall ? (
        <Paywall
          onClose={() => setShowPaywall(false)}
          onRestoreCompleted={() => setShowPaywall(false)}
          onPurchaseError={() => setShowPaywall(false)}
          onPurchaseCompleted={() => setShowPaywall(false)}
          onPurchaseCancelled={() => setShowPaywall(false)}
        />
      ) : (
        <SafeAreaView className="bg-background flex-1">
          <GestureHandlerRootView>
            <ScrollView className="flex flex-1">
              <VStack className="flex-1 px-5 py-4" space="lg">
                <ProfileCard user={session?.user ?? null} />
                <Divider className="my-2" />
                <ProfileSettings
                  onOpenDeleteAccountDialog={onOpenDeleteAccountDialog}
                />
                <ProfileSecurity
                  onOpenChangePasswordDrawer={onOpenChangePasswordDrawer}
                />
                {process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY_APPLE && (
                  <>
                    <Divider className="my-2" />
                    <PaymentPlan
                      onPress={() => setShowPaywall(true)}
                      isPro={!!activeEntitlements?.length}
                    />
                  </>
                )}
                <Divider className="my-2" />
                <ProfileSupport />
                <Divider className="my-2" />
                <SignOutButton
                  onOpenSignOutAlertDialog={onOpenSignOutAlertDialog}
                />
              </VStack>
              <SignOutAlertDialog
                onCloseSignOutAlertDialog={() =>
                  setShowSignOutAlertDialog(false)
                }
                openSignOutAlertDialog={showSignOutAlertDialog}
              />
              <DeleteAccountAlertDialog
                openDeleteAccountDialog={showDeleteAccountDialog}
                onCloseDeleteAccountDialog={() =>
                  setShowDeleteAccountDialog(false)
                }
              />
              <ChangePasswordDrawer
                isOpen={showChangePasswordDrawer}
                onClose={() => setShowChangePasswordDrawer(false)}
              />
            </ScrollView>
          </GestureHandlerRootView>
        </SafeAreaView>
      )}
    </>
  );
};

export default ProfilePage;
