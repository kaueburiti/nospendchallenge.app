import {
  SafeAreaView as RNSSafeAreaView,
  type SafeAreaViewProps,
} from 'react-native-safe-area-context';

import { Box } from './box';
import classNames from 'classnames';

type SafeAreaViewProps = {
  children: React.ReactNode;
  className?: string;
};

export const SafeAreaView = ({
  children,
  className,
  ...props
}: SafeAreaViewProps) => (
  <Box
    className={classNames(
      'flex h-full flex-1 bg-background-light dark:bg-background-dark',
      className,
    )}>
    <RNSSafeAreaView
      edges={['top', 'right', 'left']}
      style={[
        {
          flex: 1,
        },
      ]}
      className={'flex-1 bg-background-light dark:bg-background-dark'}
      {...props}>
      {children}
    </RNSSafeAreaView>
  </Box>
);
