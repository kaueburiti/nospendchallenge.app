import React from 'react';
import { Box } from '@/components/ui';

export const HomeWidgetWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
      {children}
    </Box>
  );
};
