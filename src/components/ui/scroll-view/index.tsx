'use client';

import { useState } from 'react';
import { RefreshControl, ScrollViewProps } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { ScrollView as RNScrollView } from 'react-native';

export const ScrollView = ({
  children,
  ...props
}: ScrollViewProps & { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);

    void queryClient.invalidateQueries();
  };

  return (
    <RNScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      {...props}>
      {children}
    </RNScrollView>
  );
};
