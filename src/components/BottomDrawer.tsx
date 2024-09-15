import React, { type ReactNode } from 'react';
import { Actionsheet, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper } from './ui/actionsheet';
import { VStack, Text } from './ui';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const BottomDrawer = ({ isOpen, onClose, title, children }: BottomDrawerProps) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetContent className="mt-16 flex-1">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <VStack space="lg" className="flex-1 w-full p-4 mb-20">
          {title && <Text className="text-2xl text-center font-bold">{title}</Text>}
          {children}
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};
