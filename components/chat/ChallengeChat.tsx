import React, { useState, useCallback } from 'react';
import { ActivityIndicator, View, Text, Alert, StyleSheet } from 'react-native';
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
import { useToast } from '@/hooks/useToast';
import { ActionSheet } from '@/components/ui';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChallengeChatProps {
  challengeId: string;
}

export const ChallengeChat: React.FC<ChallengeChatProps> = ({
  challengeId,
}) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const toast = useToast();
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] =
    useState<ChatMessageType | null>(null);

  const {
    messages,
    isLoading,
    error,
    onSend,
    isSending,
    updateMessage,
    isUpdating,
    deleteMessage,
    isDeleting,
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
        setActionSheetVisible(true);
      }
    },
    [currentUser],
  );

  const handleEdit = useCallback(() => {
    if (selectedMessage) {
      // In a real implementation, you would open a modal or implement in-place editing
      // For simplicity, we'll use a prompt here
      Alert.prompt(
        t('Edit Message'),
        t('Update your message:'),
        [
          {
            text: t('Cancel'),
            onPress: () => setActionSheetVisible(false),
            style: 'cancel',
          },
          {
            text: t('Update'),
            onPress: text => {
              if (text && text.trim()) {
                updateMessage(
                  {
                    messageId: selectedMessage._id,
                    message: text.trim(),
                  },
                  {
                    onSuccess: () => {
                      setActionSheetVisible(false);
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
      Alert.alert(
        t('Delete Message'),
        t('Are you sure you want to delete this message?'),
        [
          {
            text: t('Cancel'),
            style: 'cancel',
            onPress: () => setActionSheetVisible(false),
          },
          {
            text: t('Delete'),
            style: 'destructive',
            onPress: () => {
              deleteMessage(selectedMessage._id, {
                onSuccess: () => {
                  setActionSheetVisible(false);
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
    <>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: currentUser?.id || '',
          name: currentUser?.name || '',
          avatar: currentUser?.avatar || '',
        }}
        renderBubble={renderBubble}
        renderMessageText={renderMessageText}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        onLongPress={onLongPress}
        placeholder={t('Type a message...')}
        alwaysShowSend
        scrollToBottom
        infiniteScroll
      />

      <ActionSheet
        isOpen={actionSheetVisible}
        onClose={() => setActionSheetVisible(false)}>
        <ActionSheet.Item
          label={t('Edit Message')}
          onPress={handleEdit}
          leftIcon={<Feather name="edit-2" size={20} />}
        />
        <ActionSheet.Item
          label={t('Delete Message')}
          onPress={handleDelete}
          leftIcon={<Feather name="trash-2" size={20} />}
          color="danger"
        />
        <ActionSheet.Item
          label={t('Cancel')}
          onPress={() => setActionSheetVisible(false)}
        />
      </ActionSheet>
    </>
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
