import React from 'react';
import { Box } from '@/components/ui';
import classnames from 'classnames';

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
};

export const Section = ({
  children,
  className,
  fluid = false,
}: SectionProps) => {
  return (
    <Box className={classnames(fluid ? 'px-0' : 'px-4 md:px-0', className)}>
      {children}
    </Box>
  );
};
