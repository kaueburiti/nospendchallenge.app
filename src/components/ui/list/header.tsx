import React from 'react';
import { Box, Heading, VStack } from '@/components/ui';
import { PlusIcon } from 'lucide-react-native';
import { Button, Text } from '@/components/ui';

interface ListHeaderProps {
  title: string;
  description?: string;
  onPress?: () => void;
  titleSize?: 'xl' | '2xl' | '3xl' | '4xl';
}

export const ListHeader = ({
  title,
  onPress,
  description,
  titleSize = 'xl',
}: ListHeaderProps) => {
  return (
    <Box className="mb-4 flex flex-row items-start justify-between gap-4">
      <VStack space="xs" className="flex-1">
        <Heading size={titleSize}>{title}</Heading>
        {description && <Text>{description}</Text>}
      </VStack>
      {onPress && (
        <Button onPress={onPress}>
          <PlusIcon size={24} color="white" />
        </Button>
      )}
    </Box>
  );
};
