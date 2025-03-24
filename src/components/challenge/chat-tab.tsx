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
import { FeatherIcon, Icon } from 'lucide-react-native';

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
    props => {
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
    props => {
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
    props => {
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
    props => {
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
    (context, message) => {
      // Only allow editing/deleting own messages
      if (message.user._id === currentUser?.id) {
        setSelectedMessage(message);
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
        t('Edit Message'),
        t('Update your message:'),
        [
          {
            text: t('Cancel'),
            style: 'cancel',
          },
          {
            text: t('Update'),
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
                        title: t('Success'),
                        description: t('Message updated'),
                        status: 'success',
                      });
                    },
                    onError: error => {
                      toast.show({
                        title: t('Error'),
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

      Alert.alert(
        t('Delete Message'),
        t('Are you sure you want to delete this message?'),
        [
          {
            text: t('Cancel'),
            style: 'cancel',
          },
          {
            text: t('Delete'),
            style: 'destructive',
            onPress: () => {
              deleteMessage(selectedMessage._id, {
                onSuccess: () => {
                  toast.show({
                    title: t('Success'),
                    description: t('Message deleted'),
                    status: 'success',
                  });
                },
                onError: error => {
                  toast.show({
                    title: t('Error'),
                    description: error.message,
                    status: 'error',
                  });
                },
              });
            },
          },
        ],
      );
    }
  }, [selectedMessage, deleteMessage, t, toast]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>{t('Loading messages...')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{t('Error loading messages')}</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  return (
    <Box className="flex-1">
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
          placeholder={t('Type a message...')}
          alwaysShowSend
          scrollToBottomComponent={() => (
            <Feather name="chevron-down" size={24} color="#6366f1" />
          )}
        />
      </KeyboardAvoidingView>

      {/* Simple Modal instead of ActionSheet */}
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <ModalContent>
          <ModalHeader>{t('Message Options')}</ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Button
                variant="outline"
                onPress={handleEdit}
                leftIcon={<FeatherIcon size="sm" />}>
                {t('Edit Message')}
              </Button>
              <Button
                variant="outline"
                onPress={handleDelete}
                leftIcon={<FeatherIcon size="sm" />}>
                {t('Delete Message')}
              </Button>
              <Button variant="solid" onPress={() => setModalVisible(false)}>
                {t('Cancel')}
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
