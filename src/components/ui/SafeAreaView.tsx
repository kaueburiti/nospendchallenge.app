import {
  SafeAreaView as RNSSafeAreaView,
  type SafeAreaViewProps,
} from 'react-native-safe-area-context';

import { Box } from './box';

export const SafeAreaView = ({ children, ...props }: SafeAreaViewProps) => (
  <Box
    className={
      'h-full flex-1 flex bg-background-light dark:bg-background-dark'
    }>
    <RNSSafeAreaView
      edges={['top', 'right', 'left']}
      style={[
        {
          flex: 1,
        },
      ]}
      className={'bg-background-light dark:bg-background-dark flex-1'}
      {...props}>
      {children}
    </RNSSafeAreaView>
  </Box>
);
