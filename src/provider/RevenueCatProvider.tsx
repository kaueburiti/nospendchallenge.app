import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import Purchases, {
  type CustomerInfo,
  type PurchasesPackage,
} from 'react-native-purchases';

const APIKeys = {
  apple: process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY_APPLE,
};

interface RevenueCatContextProps {
  purchasePackage: (pack: PurchasesPackage) => Promise<void>;
  restorePermission: () => Promise<CustomerInfo>;
  packages: PurchasesPackage[];
  customerInfo?: CustomerInfo;
  identifyUser: (userId: string) => Promise<CustomerInfo>;
  logout: () => Promise<void>;
  initialized: boolean;
}

export const RevenueCatContext = createContext<Partial<RevenueCatContextProps>>(
  {},
);

export const RevenueCatProvider = ({ children }: PropsWithChildren) => {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    void (async () => {
      if (!APIKeys.apple) {
        setInitialized(true);
        return;
      }
      try {
        Purchases.configure({ apiKey: APIKeys.apple });
        Purchases.addCustomerInfoUpdateListener(setCustomerInfo);
        await loadCurrentOffering();
      } catch (e) {
        console.error('Failed to initialize RevenueCat:', e);
      } finally {
        setInitialized(true);
      }
    })();
  }, []);

  const loadCurrentOffering = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;
      if (currentOffering) {
        setPackages(currentOffering.availablePackages);
      }
    } catch (e) {
      console.error('Failed to load offerings:', e);
    }
  };

  const purchasePackage = async (selectedPackage: PurchasesPackage) => {
    try {
      await Purchases.purchasePackage(selectedPackage);
    } catch (e) {
      console.error(
        `Failed to purchase package ${selectedPackage.identifier}`,
        e,
      );
      throw e;
    }
  };

  const identifyUser = async (userId: string) => {
    try {
      const { customerInfo } = await Purchases.logIn(userId);
      setCustomerInfo(customerInfo);
      return customerInfo;
    } catch (e) {
      console.error('Failed to identify user with RevenueCat', e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await Purchases.logOut();
      setCustomerInfo(undefined);
    } catch (e) {
      console.error('Failed to logout from RevenueCat', e);
      throw e;
    }
  };

  if (!initialized) {
    return null;
  }

  return (
    <RevenueCatContext.Provider
      value={{
        purchasePackage,
        restorePermission: () => Purchases.restorePurchases(),
        packages,
        customerInfo,
        identifyUser,
        logout,
        initialized,
      }}>
      {children}
    </RevenueCatContext.Provider>
  );
};
