import RevenueCatUI, {
  type FullScreenPaywallViewOptions,
} from 'react-native-purchases-ui';
import { VStack } from '../ui';
import {
  type CustomerInfo,
  type PurchasesError,
  type PurchasesPackage,
  type PurchasesStoreTransaction,
} from 'react-native-purchases';
import { useSimpleToast } from '@/hooks/useSimpleToast';
import { useContext } from 'react';
import { RevenueCatContext } from '@/provider/RevenueCatProvider';

interface PaywallProps {
  onClose: () => void;
  options?: FullScreenPaywallViewOptions;
  onPurchaseStarted?: ({
    packageBeingPurchased,
  }: {
    packageBeingPurchased: PurchasesPackage;
  }) => void;
  onPurchaseCompleted?: ({
    customerInfo,
    storeTransaction,
  }: {
    customerInfo: CustomerInfo;
    storeTransaction: PurchasesStoreTransaction;
  }) => void;
  onPurchaseError?: ({ error }: { error: PurchasesError }) => void;
  onPurchaseCancelled?: () => void;
  onRestoreStarted?: () => void;
  onRestoreCompleted?: ({
    customerInfo,
  }: {
    customerInfo: CustomerInfo;
  }) => void;
  onRestoreError?: ({ error }: { error: PurchasesError }) => void;
}

const Paywall = ({ onClose, ...paywallProps }: PaywallProps) => {
  const { showToast } = useSimpleToast();
  const { initialized } = useContext(RevenueCatContext);

  const handlePurchaseError = () => {
    showToast('error', 'Oops. Something went wrong!');
  };

  if (!initialized) {
    return null;
  }

  return (
    <VStack className="flex-1">
      <RevenueCatUI.Paywall
        onDismiss={onClose}
        onPurchaseCancelled={onClose}
        onPurchaseCompleted={onClose}
        onRestoreError={onClose}
        onRestoreCompleted={onClose}
        onPurchaseError={handlePurchaseError}
        options={{
          displayCloseButton: true,
        }}
        {...paywallProps}
      />
    </VStack>
  );
};

export default Paywall;
