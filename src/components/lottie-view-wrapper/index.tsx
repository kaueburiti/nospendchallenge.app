import React from 'react';
import { Box } from '@/components/ui';

interface LottieViewWrapperProps {
  height: number;
  width: number;
  children: React.ReactNode;
}

export default function LottieViewWrapper({
  children,
  height,
  width,
}: LottieViewWrapperProps) {
  return (
    <Box
      style={{
        height,
        width,
      }}
      className={`relative flex items-center justify-between`}>
      <Box className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </Box>
    </Box>
  );
}
