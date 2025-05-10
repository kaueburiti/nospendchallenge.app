import React, { useContext } from 'react';
import { Box, HStack, Text } from '@/components/ui';
import { RevenueCatContext } from '@/provider/RevenueCatProvider';

interface HomeWidgetWrapperProps {
  children: React.ReactNode;
  isPro?: boolean;
}

export const HomeWidgetWrapper = ({
  children,
  isPro = false,
}: HomeWidgetWrapperProps) => {
  const { isProUser } = useContext(RevenueCatContext);

  return (
    <Box className="relative flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
      {isPro && !isProUser && (
        <Box className="absolute -right-1 top-1 z-10">
          <Box className="rounded-sm bg-primary-500 px-2 py-0.5">
            <Text className="text-xs font-bold text-white">Pro Feature</Text>
          </Box>
        </Box>
      )}
      {children}
    </Box>
  );
};
