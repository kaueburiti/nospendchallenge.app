import React from 'react';
import { Box } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import Paywall from '@/components/payment/paywall';

const PaywallPage = () => {
  const { t } = useTranslation();

  return (
    <Box className="h-full flex-1 bg-red-100">
      <Paywall
        onClose={() => {}}
        onRestoreCompleted={() => {}}
        onPurchaseError={() => {}}
        onPurchaseCompleted={() => {}}
        onPurchaseCancelled={() => {}}
      />
    </Box>
  );
};

export default PaywallPage;
