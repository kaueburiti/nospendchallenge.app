import React from 'react';
import { View, Pressable } from 'react-native';
import { Box, HStack, Text, Avatar, Menu, Button, Icon } from '@/components/ui';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatMessageProps {
  message: ChatMessageType;
  onEdit?: (messageId: string, currentText: string) => void;
  onDelete?: (messageId: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onEdit,
  onDelete,
}) => {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const isMyMessage = message.profile_id === user?.id;

  const formattedTime = formatDistanceToNow(new Date(message.created_at), {
    addSuffix: true,
    includeSeconds: true,
  });

  const isEdited =
    message.updated_at &&
    new Date(message.updated_at).getTime() >
      new Date(message.created_at).getTime();

  return (
    <Box
      className={`mb-2 max-w-[85%] rounded-lg p-3 ${
        isMyMessage
          ? 'ml-auto bg-primary-600 dark:bg-primary-800'
          : 'mr-auto bg-gray-200 dark:bg-gray-800'
      }`}>
      <HStack space="xs" alignItems="center" mb={1}>
        <Avatar
          size="xs"
          source={{ uri: message.profiles.avatar_url || undefined }}
          fallbackText={message.profiles.display_name?.charAt(0) || '?'}
        />
        <Text
          className={`text-sm font-medium ${
            isMyMessage
              ? 'text-white dark:text-white'
              : 'text-gray-800 dark:text-gray-200'
          }`}>
          {message.profiles.display_name}
        </Text>

        {isMyMessage && (
          <Menu
            trigger={({ ...triggerProps }) => (
              <Pressable {...triggerProps} className="ml-auto">
                <Icon
                  as={Feather}
                  name="more-vertical"
                  size="sm"
                  color={colorScheme === 'dark' ? 'white' : 'white'}
                />
              </Pressable>
            )}>
            {onEdit && (
              <Menu.Item
                onPress={() => onEdit(message.id, message.message)}
                className="flex-row items-center">
                <Icon as={Feather} name="edit-2" size="sm" mr={2} />
                <Text>Edit</Text>
              </Menu.Item>
            )}

            {onDelete && (
              <Menu.Item
                onPress={() => onDelete(message.id)}
                className="flex-row items-center">
                <Icon as={Feather} name="trash-2" size="sm" mr={2} />
                <Text>Delete</Text>
              </Menu.Item>
            )}
          </Menu>
        )}
      </HStack>

      <Text
        className={`${
          isMyMessage
            ? 'text-white dark:text-white'
            : 'text-gray-800 dark:text-gray-200'
        }`}>
        {message.message}
      </Text>

      <HStack space="xs" justifyContent="flex-end" mt={1}>
        <Text
          className={`text-xs ${
            isMyMessage
              ? 'text-gray-200 dark:text-gray-300'
              : 'text-gray-500 dark:text-gray-400'
          }`}>
          {formattedTime}
          {isEdited && ' (edited)'}
        </Text>
      </HStack>
    </Box>
  );
};
