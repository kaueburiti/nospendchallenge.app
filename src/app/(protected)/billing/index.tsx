import React, { useContext, useState } from 'react';
import { VStack, HStack, Text, Box } from '@/components/ui';
import { Heading } from '@/components/ui';
import { MenuItem } from '@/components/MenuItem';
import { CreditCard, ChevronLeft } from 'lucide-react-native';
import { Alert, Linking } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { router } from 'expo-router';
import { RevenueCatContext } from '@/provider/RevenueCatProvider';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Button, ButtonText } from '@/components/ui';

const BillingPage = () => {
  const { t } = useTranslation();
  const { customerInfo } = useContext(RevenueCatContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleManageSubscription = async () => {
    if (!customerInfo?.managementURL) {
      Alert.alert(
        t('common.error_occurred'),
        t('profile.cancel_subscription_error'),
      );
      return;
    }

    try {
      setIsLoading(true);
      const supported = await Linking.canOpenURL(customerInfo.managementURL);

      if (supported) {
        await Linking.openURL(customerInfo.managementURL);
      } else {
        Alert.alert(
          t('common.error_occurred'),
          t('profile.cancel_subscription_error'),
        );
      }
    } catch (error) {
      Alert.alert(
        t('common.error_occurred'),
        t('profile.cancel_subscription_error'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Get the first active subscription and its expiration date
  const activeSubscription = customerInfo?.activeSubscriptions?.[0];
  const expirationDate =
    activeSubscription && customerInfo?.allExpirationDates?.[activeSubscription]
      ? new Date(customerInfo.allExpirationDates[activeSubscription])
      : null;

  return (
    <SafeAreaView className="bg-background flex-1">
      <VStack className="flex-1 px-5 py-4" space="lg">
        {/* Header */}
        <HStack className="items-center">
          <Button variant="link" onPress={() => router.back()} className="mr-2">
            <ButtonText>
              <ChevronLeft size={24} />
            </ButtonText>
          </Button>
          <Heading>{t('profile.billing_title')}</Heading>
        </HStack>

        {/* Current Plan Status */}
        <Box className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <VStack space="md">
            <HStack className="items-center justify-between">
              <Text className="text-gray-600 dark:text-gray-300">
                {t('profile.subscription_status')}
              </Text>
              <Text className="font-semibold text-primary-500">
                {t('payment.plans.full')}
              </Text>
            </HStack>

            {expirationDate && (
              <HStack className="items-center justify-between">
                <Text className="text-gray-600 dark:text-gray-300">
                  {t('profile.renewal_date')}
                </Text>
                <Text className="font-semibold">
                  {expirationDate.toLocaleDateString()}
                </Text>
              </HStack>
            )}
          </VStack>
        </Box>

        {/* Management Action */}
        <MenuItem
          icon={CreditCard}
          text={t('profile.manage_subscription')}
          onPress={handleManageSubscription}
        />
      </VStack>
    </SafeAreaView>
  );
};

export default BillingPage;
