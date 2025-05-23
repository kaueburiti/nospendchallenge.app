import React from 'react';
import { Box } from '@/components/ui';
import Paywall from '@/components/payment/paywall';
import { useRouter } from 'expo-router';
import { useCaptureEvent } from '@/hooks/analytics/useCaptureEvent';

const PaywallPage = () => {
  const router = useRouter();
  const { captureEvent } = useCaptureEvent();

  const handleClose = () => {
    captureEvent('PAYWALL_CLOSED');
  };

  return (
    <Box className="h-full flex-1 bg-red-100">
      <Paywall
        onClose={handleClose}
        onPurchaseCompleted={() => {
          router.replace('/(protected)/(tabs)/home');
        }}
      />
    </Box>
  );
};

export default PaywallPage;
