import React, { useContext, useState } from 'react';
import { VStack } from '@/components/ui';
import { Heading } from '@/components/ui';
import { Divider } from '@/components/ui';
import { Button, ButtonText } from '@/components/ui';
import { useDisclose } from '@gluestack-ui/hooks';
import { MenuItem } from '@/components/MenuItem';
import {
  LifeBuoyIcon,
  MessageSquareText,
  OctagonX,
  SunMoon,
  Lock,
} from 'lucide-react-native';
import { HStack, Text } from '@/components/ui';
import { Switch } from '@/components/ui';
import { ProfileCard } from '@/components/profile/ProfileCard';
import SignOutAlertDialog from '../../../components/profile/SignOutAlertDialog';
import DeleteAccountAlertDialog from '../../../components/profile/DeleteAccountAlertDialog';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { useSession } from '@/hooks/useSession';
import { RevenueCatContext } from '@/provider/RevenueCatProvider';
import Paywall from '../../../components/payment/paywall';
import config from '../../../../config';
import {
  ScrollView,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { PaymentPlan } from '@/components/profile/PaymentPlan';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@/components/ui/icon';
import { i18n } from '@/i18n';
import ChangePasswordDrawer from '@/components/profile/ChangePasswordDrawer';

type ProfileSettingsProps = {
  toggleColorMode: () => void;
  isDark: boolean;
  onOpenDeleteAccountDialog: () => void;
};

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  toggleColorMode,
  isDark,
  onOpenDeleteAccountDialog,
}) => (
  <VStack space="lg">
    <Heading className="mb-1">{i18n.t('profile.settings_title')}</Heading>
    <HStack className="items-center justify-between">
      <HStack space="md">
        <Icon as={SunMoon} />
        <Text>{i18n.t('profile.dark_mode')}</Text>
      </HStack>
      <Switch value={isDark} onValueChange={toggleColorMode} size="sm" />
    </HStack>
    <MenuItem
      icon={OctagonX}
      onPress={onOpenDeleteAccountDialog}
      text={i18n.t('profile.delete_account')}
    />
  </VStack>
);

const ProfileSupport: React.FC = () => (
  <VStack space="lg">
    <Heading className="mb-1">{i18n.t('profile.support_title')}</Heading>
    <MenuItem
      onPress={() =>
        WebBrowser.openBrowserAsync(config.profilePage.supportPage)
      }
      icon={LifeBuoyIcon}
      text={i18n.t('profile.get_help')}
    />
    <MenuItem
      onPress={() =>
        WebBrowser.openBrowserAsync(config.profilePage.contactPage)
      }
      icon={MessageSquareText}
      text={i18n.t('profile.contact')}
    />
  </VStack>
);

type ProfileSignOutProps = {
  onOpenSignOutAlertDialog: () => void;
};

const ProfileSignOut: React.FC<ProfileSignOutProps> = ({
  onOpenSignOutAlertDialog,
}) => (
  <Button
    action="secondary"
    variant="outline"
    className="mt-auto"
    onPress={onOpenSignOutAlertDialog}>
    <ButtonText>{i18n.t('profile.sign_out')}</ButtonText>
  </Button>
);

type ProfileSecurityProps = {
  onOpenChangePasswordDrawer: () => void;
};

const ProfileSecurity: React.FC<ProfileSecurityProps> = ({
  onOpenChangePasswordDrawer,
}) => (
  <VStack space="lg">
    <Heading className="mb-1">{i18n.t('profile.security_title')}</Heading>
    <MenuItem
      icon={Lock}
      onPress={onOpenChangePasswordDrawer}
      text={i18n.t('profile.change_password')}
    />
  </VStack>
);

const ProfilePage = () => {
  const [showPaywall, setShowPaywall] = useState(false);
  const {
    isOpen: openSignOutAlertDialog,
    onOpen: onOpenSignOutAlertDialog,
    onClose: onCloseSignOutAlertDialog,
  } = useDisclose(false);
  const {
    isOpen: openDeleteAccountDialog,
    onOpen: onOpenDeleteAccountDialog,
    onClose: onCloseDeleteAccountDialog,
  } = useDisclose(false);
  const {
    isOpen: openChangePasswordDrawer,
    onOpen: onOpenChangePasswordDrawer,
    onClose: onCloseChangePasswordDrawer,
  } = useDisclose(false);

  const { toggleColorMode, isDark } = useTheme();
  const { user } = useSession();
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
        <SafeAreaView>
          <GestureHandlerRootView>
            <ScrollView className="flex flex-1">
              <VStack className="flex-1 px-5 py-4" space="lg">
                <ProfileCard user={user} />
                <Divider className="my-2" />
                <ProfileSettings
                  toggleColorMode={toggleColorMode}
                  isDark={isDark}
                  onOpenDeleteAccountDialog={onOpenDeleteAccountDialog}
                />
                <Divider className="my-2" />
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
                <ProfileSignOut
                  onOpenSignOutAlertDialog={onOpenSignOutAlertDialog}
                />
              </VStack>
              <SignOutAlertDialog
                onCloseSignOutAlertDialog={onCloseSignOutAlertDialog}
                openSignOutAlertDialog={openSignOutAlertDialog}
              />
              <DeleteAccountAlertDialog
                openDeleteAccountDialog={openDeleteAccountDialog}
                onCloseDeleteAccountDialog={onCloseDeleteAccountDialog}
              />
              <ChangePasswordDrawer
                isOpen={openChangePasswordDrawer}
                onClose={onCloseChangePasswordDrawer}
              />
            </ScrollView>
          </GestureHandlerRootView>
        </SafeAreaView>
      )}
    </>
  );
};

export default ProfilePage;
