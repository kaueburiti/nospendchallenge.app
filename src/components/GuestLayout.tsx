import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { VStack } from './ui/vstack';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from '@/components/ui/scroll-view';
import { Box } from './ui/box';
import { SafeAreaView } from './ui/SafeAreaView';

type GuestLayoutProps = {
  children: React.ReactNode;
};

export default function GuestLayout(props: GuestLayoutProps) {
  return (
    <SafeAreaView
      className={'flex-1 bg-[#f8f8f8] dark:bg-background-dark'}
      style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={{ height: '100%', flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}>
        <Box className={'flex h-full flex-1'}>
          <StatusBar translucent style="auto" />
          <ScrollView
            className={'flex-1'}
            contentContainerStyle={{
              alignItems: 'center',
              flexGrow: 1,
              justifyContent: 'center',
            }}
            bounces={false}>
            <VStack className={'w-full flex-1 overflow-hidden'}>
              {props.children}
            </VStack>
          </ScrollView>
        </Box>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
