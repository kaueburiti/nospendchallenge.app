import React from 'react';
import { Text, HStack } from './ui';
import { ChevronRight } from 'lucide-react-native';
import { Pressable } from 'react-native';
import {Icon} from "@/components/ui/icon";

interface MenuItemProps {
  icon: React.ElementType;
  text: string;
  onPress?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ icon, text, onPress }) => (
  <Pressable className="w-full justify-between" onPress={onPress}>
      <HStack className="w-full justify-between">
        <HStack space="md">
          <Icon as={icon} fill={'none'} />
          <Text>{text}</Text>
        </HStack>
        <Icon as={ChevronRight} />
      </HStack>
  </Pressable>
);
