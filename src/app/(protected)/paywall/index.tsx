import React from 'react';
import { Box } from '@/components/ui';
import Paywall from '@/components/payment/paywall';
import { useRouter } from 'expo-router';

const PaywallPage = () => {
  const router = useRouter();

  return (
    <Box className="h-full flex-1 bg-red-100">
      <Paywall
        onClose={() => {}}
        onRestoreCompleted={() => {}}
        onPurchaseCompleted={() => {
          router.replace('/(protected)/(tabs)/home');
        }}
      />
    </Box>
  );
};

export default PaywallPage;
