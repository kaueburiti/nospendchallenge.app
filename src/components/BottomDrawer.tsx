import React, { type ReactNode } from 'react';
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from './ui/actionsheet';
import { VStack, Text } from './ui';
import { KeyboardAvoidingView } from './ui/keyboard-avoiding-view';
import { ScrollView } from 'react-native';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const BottomDrawer = ({
  isOpen,
  onClose,
  title,
  children,
}: BottomDrawerProps) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetContent className="mt-16 flex-1">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <KeyboardAvoidingView
          behavior="padding"
          className="w-full flex-1"
          keyboardVerticalOffset={50}>
          <VStack space="lg" className="mb-20 w-full flex-1 p-4">
            <ScrollView>
              {title && (
                <Text className="text-center text-2xl font-bold">{title}</Text>
              )}
              {children}
            </ScrollView>
          </VStack>
        </KeyboardAvoidingView>
      </ActionsheetContent>
    </Actionsheet>
  );
};
