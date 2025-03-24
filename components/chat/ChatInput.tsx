import React, { useState } from 'react';
import { Box, HStack, Input, IconButton, Icon, Spinner } from '@/components/ui';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  isEditing?: boolean;
  editValue?: string;
  onCancelEdit?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading = false,
  isEditing = false,
  editValue = '',
  onCancelEdit,
}) => {
  const colorScheme = useColorScheme();
  const [message, setMessage] = useState(editValue);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleCancel = () => {
    if (onCancelEdit) {
      onCancelEdit();
      setMessage('');
    }
  };

  return (
    <Box className="border-t border-gray-200 bg-white p-2 pb-4 dark:border-gray-800 dark:bg-gray-900">
      <HStack space="sm" alignItems="center">
        {isEditing && (
          <IconButton
            variant="ghost"
            icon={<Icon as={Feather} name="x" size="sm" />}
            onPress={handleCancel}
            className="p-2"
          />
        )}

        <Input
          flex={1}
          placeholder={isEditing ? 'Edit your message...' : 'Type a message...'}
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSend}
          autoCapitalize="sentences"
          multiline
          maxHeight={100}
          borderRadius="full"
          className="bg-gray-100 dark:bg-gray-800"
        />

        <IconButton
          variant="solid"
          colorScheme="primary"
          borderRadius="full"
          icon={
            isLoading ? (
              <Spinner size="sm" color="white" />
            ) : (
              <Icon as={Feather} name="send" size="sm" />
            )
          }
          onPress={handleSend}
          isDisabled={isLoading || !message.trim()}
        />
      </HStack>
    </Box>
  );
};
