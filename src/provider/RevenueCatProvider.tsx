import { createContext, type PropsWithChildren, useEffect, useState } from 'react';
import Purchases, { type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';

const APIKeys = {
    apple: process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY_APPLE
}

interface RevenueCatContextProps {
    purchasePackage: (pack: PurchasesPackage) => Promise<void>;
    restorePermission: () => Promise<CustomerInfo>;
    packages: PurchasesPackage[];
    customerInfo?: CustomerInfo;
    identifyUser: (userId: string) => Promise<CustomerInfo>;
    logout: () => Promise<void>;
}

export const RevenueCatContext = createContext<Partial<RevenueCatContextProps>>({})

export const RevenueCatProvider = ({ children }: PropsWithChildren) => {
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>();

    useEffect(() => {
        void (async () => {
            if (!APIKeys.apple) return;
            Purchases.configure({apiKey: APIKeys.apple});
            Purchases.addCustomerInfoUpdateListener(setCustomerInfo);
            await loadCurrentOffering();
        })()
    }, []);

    const loadCurrentOffering = async () => {
        const offerings = await Purchases.getOfferings();

        const currentOffering = offerings.current;
        if (currentOffering) {
            setPackages(currentOffering.availablePackages)
        }
    }

    const purchasePackage = async (selectedPackage: PurchasesPackage) => {
        try {
            await Purchases.purchasePackage(selectedPackage);
        } catch(e) {
            console.error(`Failed to purchase package ${selectedPackage.identifier}`, e)
            throw e;
        }
    }

    const identifyUser = async (userId: string) => {
        try {
            const { customerInfo } = await Purchases.logIn(userId);
            setCustomerInfo(customerInfo);
            return customerInfo;
        } catch (e) {
            console.error('Failed to identify user with RevenueCat', e);
            throw e;
        }
    }

    const logout = async () => {
        try {
            await Purchases.logOut();
            setCustomerInfo(undefined);
        } catch (e) {
            console.error('Failed to logout from RevenueCat', e);
            throw e;
        }
    }

    return (
        <RevenueCatContext.Provider
            value={{
                purchasePackage,
                restorePermission: () => Purchases.restorePurchases(),
                packages,
                customerInfo,
                identifyUser,
                logout
            }}
        >
            {children}
        </RevenueCatContext.Provider>
    )
}