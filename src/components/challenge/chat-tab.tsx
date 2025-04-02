import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  MessageText,
  InputToolbar,
  Send,
  IMessage,
  BubbleProps,
  MessageTextProps,
  InputToolbarProps,
  SendProps,
} from 'react-native-gifted-chat';
import { Feather } from '@expo/vector-icons';
import { useChallengeChatMessages } from '@/hooks/useChallengeChatMessages';
import { useTranslation } from '@/hooks/useTranslation';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSimpleToast } from '@/hooks/useToast';
import { Box, Button, VStack } from '@/components/ui';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@/components/ui/modal';
import { Edit, Trash, X } from 'lucide-react-native';

interface ChallengeChatTabProps {
  challengeId: string;
}

const ChallengeChatTab = ({ challengeId }: ChallengeChatTabProps) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const toast = useSimpleToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] =
    useState<ChatMessageType | null>(null);

  const {
    messages,
    isLoading,
    error,
    onSend,
    updateMessage,
    deleteMessage,
    currentUser,
  } = useChallengeChatMessages(challengeId);

  const renderBubble = useCallback(
    (props: BubbleProps<IMessage>) => {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: colorScheme === 'dark' ? '#4b5563' : '#6366f1',
            },
            left: {
              backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#e5e7eb',
            },
          }}
          textStyle={{
            right: {
              color: '#ffffff',
            },
            left: {
              color: colorScheme === 'dark' ? '#ffffff' : '#000000',
            },
          }}
        />
      );
    },
    [colorScheme],
  );

  const renderMessageText = useCallback(
    (props: MessageTextProps<IMessage>) => {
      return (
        <MessageText
          {...props}
          textStyle={{
            right: {
              color: '#ffffff',
            },
            left: {
              color: colorScheme === 'dark' ? '#ffffff' : '#000000',
            },
          }}
        />
      );
    },
    [colorScheme],
  );

  const renderInputToolbar = useCallback(
    (props: InputToolbarProps<IMessage>) => {
      return (
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
            borderTopColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
          }}
        />
      );
    },
    [colorScheme],
  );

  const renderSend = useCallback(
    (props: SendProps<IMessage>) => {
      return (
        <Send
          {...props}
          containerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginRight: 10,
          }}>
          <Feather
            name="send"
            size={24}
            color={colorScheme === 'dark' ? '#6366f1' : '#6366f1'}
          />
        </Send>
      );
    },
    [colorScheme],
  );

  const onLongPress = useCallback(
    (_context: unknown, message: IMessage) => {
      // Only allow editing/deleting own messages
      if (message.user._id === currentUser?.id) {
        setSelectedMessage(message as ChatMessageType);
        setModalVisible(true);
      }
    },
    [currentUser],
  );

  const handleEdit = useCallback(() => {
    if (selectedMessage) {
      // Close the modal first
      setModalVisible(false);

      // In a real implementation, you would open a modal or implement in-place editing
      // For simplicity, we'll use a prompt here
      Alert.prompt(
        t('chat.edit_message'),
        t('chat.update_message_prompt'),
        [
          {
            text: t('chat.cancel'),
            style: 'cancel',
          },
          {
            text: t('chat.update'),
            onPress: text => {
              if (text?.trim()) {
                updateMessage(
                  {
                    messageId: selectedMessage._id,
                    message: text.trim(),
                  },
                  {
                    onSuccess: () => {
                      toast.show({
                        title: t('chat.success'),
                        description: t('chat.message_updated'),
                        status: 'success',
                      });
                    },
                    onError: error => {
                      toast.show({
                        title: t('chat.error'),
                        description: error.message,
                        status: 'error',
                      });
                    },
                  },
                );
              }
            },
          },
        ],
        'plain-text',
        selectedMessage.text,
      );
    }
  }, [selectedMessage, updateMessage, t, toast]);

  const handleDelete = useCallback(() => {
    if (selectedMessage) {
      // Close the modal first
      setModalVisible(false);

      Alert.alert(t('chat.delete_message'), t('chat.delete_message_confirm'), [
        {
          text: t('chat.cancel'),
          style: 'cancel',
        },
        {
          text: t('chat.delete'),
          style: 'destructive',
          onPress: () => {
            deleteMessage(selectedMessage._id, {
              onSuccess: () => {
                toast.show({
                  title: t('chat.success'),
                  description: t('chat.message_deleted'),
                  status: 'success',
                });
              },
              onError: error => {
                toast.show({
                  title: t('chat.error'),
                  description: error.message,
                  status: 'error',
                });
              },
            });
          },
        },
      ]);
    }
  }, [selectedMessage, deleteMessage, t, toast]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>{t('chat.loading_messages')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{t('chat.error_loading_messages')}</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  return (
    <Box className="flex-1 p-6">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: currentUser?.id ?? '',
            name: currentUser?.name ?? '',
            avatar: currentUser?.avatar ?? '',
          }}
          renderUsernameOnMessage={true}
          renderBubble={renderBubble}
          renderMessageText={renderMessageText}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          onLongPress={onLongPress}
          placeholder={t('chat.message_placeholder')}
          alwaysShowSend
          scrollToBottomComponent={() => (
            <Feather name="chevron-down" size={24} color="#6366f1" />
          )}
        />
      </KeyboardAvoidingView>

      {/* Simple Modal instead of ActionSheet */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <ModalContent>
          <ModalHeader>{t('chat.message_options')}</ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Button variant="outline" onPress={handleEdit}>
                <Box className="flex-row items-center space-x-2">
                  <Edit size={20} />
                  <Text>{t('chat.edit_message')}</Text>
                </Box>
              </Button>
              <Button variant="outline" onPress={handleDelete}>
                <Box className="flex-row items-center space-x-2">
                  <Trash size={20} />
                  <Text>{t('chat.delete_message')}</Text>
                </Box>
              </Button>
              <Button variant="outline" onPress={() => setModalVisible(false)}>
                <Box className="flex-row items-center space-x-2">
                  <X size={20} />
                  <Text>{t('chat.cancel')}</Text>
                </Box>
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ChallengeChatTab;
