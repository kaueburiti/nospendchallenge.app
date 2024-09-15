import React, { type PropsWithChildren } from 'react';
import { HStack } from './ui';

const Banner = ({children}: PropsWithChildren) => {
  return (
    <HStack
      className="justify-center items-center h-16 bg-shade-0 bg-primary-700 dark:bg-primary-200"
      space="sm"
    >
      {children}
    </HStack>
  );
};
export default Banner;
