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
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaymentPlan } from '@/components/profile/PaymentPlan';
import * as WebBrowser from 'expo-web-browser';
import {useTheme} from "@/hooks/useTheme";
import {Icon} from "@/components/ui/icon";

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
    <Heading className="mb-1">Settings</Heading>
    <HStack className="justify-between items-center">
      <HStack space="md">
        <Icon as={SunMoon} />
        <Text>Dark Mode</Text>
      </HStack>
      <Switch value={isDark} onValueChange={toggleColorMode} size="sm" />
    </HStack>
    <MenuItem
      icon={OctagonX}
      onPress={onOpenDeleteAccountDialog}
      text="Delete Account"
    />
  </VStack>
);



const ProfileSupport: React.FC = () => (
  <VStack space="lg">
    <Heading className="mb-1">Support</Heading>
    <MenuItem
      onPress={() => WebBrowser.openBrowserAsync(config.profilePage.supportPage)}
      icon={LifeBuoyIcon}
      text="Get Help"
    />
    <MenuItem onPress={() => WebBrowser.openBrowserAsync(config.profilePage.contactPage)} icon={MessageSquareText} text="Contact" />
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
    <ButtonText>Sign out</ButtonText>
  </Button>
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
              <VStack className="px-5 py-4 flex-1" space="lg">
                <ProfileCard user={user} />
                <Divider className="my-2" />
                <ProfileSettings
                  toggleColorMode={toggleColorMode}
                  isDark={isDark}
                  onOpenDeleteAccountDialog={onOpenDeleteAccountDialog}
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
            </ScrollView>
          </GestureHandlerRootView>
        </SafeAreaView>
      )}
    </>
  );
};

export default ProfilePage;
