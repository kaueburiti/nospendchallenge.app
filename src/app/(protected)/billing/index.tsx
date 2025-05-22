import React, { useContext, useState } from 'react';
import { VStack, Text, Box } from '@/components/ui';
import { Heading } from '@/components/ui';
import { Alert, Linking } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { RevenueCatContext } from '@/provider/RevenueCatProvider';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { Button, ButtonText } from '@/components/ui';
import BackButton from '@/components/navigation/back-button';
import { Section } from '@/components/Section';

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
    } catch {
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
      : new Date();

  return (
    <SafeAreaView>
      <Section className="h-full flex-1">
        <VStack className="flex-1 py-4" space="4xl">
          <VStack space="xs">
            <BackButton />
            <VStack>
              <Heading size="3xl">{t('profile.billing_title')}</Heading>
              <Text>{t('profile.billing_description')}</Text>
            </VStack>
          </VStack>

          {/* Current Plan Status */}
          <Box className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <VStack space="4xl">
              <VStack space="md">
                <VStack className="justify-between">
                  <Text className="text-sm">
                    {t('profile.subscription_status')}
                  </Text>
                  <Text className="text-2xl font-semibold">
                    {t('payment.plans.full')}
                  </Text>
                </VStack>

                <VStack className="justify-between">
                  <Text className="text-sm">{t('profile.renewal_date')}</Text>
                  <Text className="text-2xl">
                    {expirationDate.toLocaleDateString()}
                  </Text>
                </VStack>
              </VStack>

              <Button
                variant="outline"
                onPress={handleManageSubscription}
                disabled={isLoading}>
                <ButtonText>{t('profile.manage_subscription')}</ButtonText>
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Section>
    </SafeAreaView>
  );
};

export default BillingPage;
