import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  getChallengeMessages,
  sendChallengeMessage,
  updateChallengeMessage,
  deleteChallengeMessage,
} from '@/lib/db/repository/chat';
import type { ChatMessage, UpdateMessageParams } from '@/types/chat';
import type { IMessage } from 'react-native-gifted-chat';
import { useSimpleToast } from '@/hooks/useSimpleToast';
export const useChallengeChatMessages = (challengeId: string) => {
  const queryClient = useQueryClient();
  const toast = useSimpleToast();
  const queryKey = ['challenge', challengeId, 'messages'];
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name?: string;
    avatar?: string;
  } | null>(null);

  // Get the current user profile
  const { isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url')
        .eq('id', userData.user.id)
        .single();

      if (error) throw new Error(error.message);

      setCurrentUser({
        id: profile.id,
        name: profile.display_name || '',
        avatar: profile.avatar_url || undefined,
      });

      return profile;
    },
  });

  // Get all messages for a challenge
  const {
    data: messages,
    isLoading: isLoadingMessages,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => getChallengeMessages(challengeId),
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  // Send a new message
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: (text: string) => sendChallengeMessage(challengeId, text),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: error => {
      toast.showToast(
        'error',
        'Something went wrong',
        'Error sending message, please try again.',
      );

      console.error('Error sending message', error);
    },
  });

  // Update a message
  const { mutate: updateMessage, isPending: isUpdating } = useMutation({
    mutationFn: ({ messageId, message }: UpdateMessageParams) =>
      updateChallengeMessage(messageId, message),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: error => {
      toast.showToast(
        'error',
        'Something went wrong',
        'Error updating message, please try again.',
      );

      console.error('Error updating message', error);
    },
  });

  // Delete a message
  const { mutate: deleteMessage, isPending: isDeleting } = useMutation({
    mutationFn: (messageId: string) => deleteChallengeMessage(messageId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: error => {
      toast.showToast(
        'error',
        'Something went wrong',
        'Error deleting message, please try again.',
      );

      console.error('Error deleting message', error);
    },
  });

  // For GiftedChat's onSend prop
  const handleSend = (messages: IMessage[] = []) => {
    if (messages.length > 0) {
      sendMessage(messages[0].text);
    }
  };

  return {
    messages: messages || [],
    isLoading: isLoadingMessages || isLoadingUser,
    error,
    onSend: handleSend,
    isSending,
    updateMessage,
    isUpdating,
    deleteMessage,
    isDeleting,
    currentUser,
  };
};
