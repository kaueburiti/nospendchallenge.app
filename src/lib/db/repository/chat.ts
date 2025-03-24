import { supabase } from '@/lib/supabase';
import type { ChatMessage, DBChatMessage } from '@/types/chat';

/**
 * Convert database message to GiftedChat message format
 */
const convertToGiftedChatMessage = (dbMessage: DBChatMessage): ChatMessage => {
  return {
    _id: dbMessage.id,
    text: dbMessage.message,
    createdAt: new Date(dbMessage.created_at),
    user: {
      _id: dbMessage.profile_id,
      name: dbMessage.profiles.display_name || '',
      avatar: dbMessage.profiles.avatar_url || undefined,
    },
  };
};

/**
 * Get all chat messages for a specific challenge
 */
export const getChallengeMessages = async (
  challengeId: string,
): Promise<ChatMessage[]> => {
  const numericChallengeId = parseInt(challengeId, 10);

  const { data, error } = await supabase
    .from('challenge_chat_messages')
    .select(
      `
      id,
      message,
      created_at,
      updated_at,
      profile_id,
      profiles:profiles(id, display_name, avatar_url)
    `,
    )
    .eq('challenge_id', numericChallengeId)
    .order('created_at', { ascending: false }); // GiftedChat expects newest messages first

  if (error) throw new Error(error.message);
  return (data || []).map(convertToGiftedChatMessage);
};

/**
 * Send a new message in a challenge chat
 */
export const sendChallengeMessage = async (
  challengeId: string,
  message: string,
): Promise<ChatMessage> => {
  const numericChallengeId = parseInt(challengeId, 10);
  const { data: profile } = await supabase.auth.getUser();
  if (!profile.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('challenge_chat_messages')
    .insert({
      challenge_id: numericChallengeId,
      profile_id: profile.user.id,
      message,
    })
    .select(
      `
      id,
      message,
      created_at,
      updated_at,
      profile_id,
      profiles:profiles(id, display_name, avatar_url)
    `,
    )
    .single();

  if (error) throw new Error(error.message);
  return convertToGiftedChatMessage(data);
};

/**
 * Update an existing message
 */
export const updateChallengeMessage = async (
  messageId: string,
  message: string,
): Promise<ChatMessage> => {
  const { data, error } = await supabase
    .from('challenge_chat_messages')
    .update({ message })
    .eq('id', messageId)
    .select(
      `
      id,
      message,
      created_at,
      updated_at,
      profile_id,
      profiles:profiles(id, display_name, avatar_url)
    `,
    )
    .single();

  if (error) throw new Error(error.message);
  return convertToGiftedChatMessage(data);
};

/**
 * Delete a message
 */
export const deleteChallengeMessage = async (
  messageId: string,
): Promise<void> => {
  const { error } = await supabase
    .from('challenge_chat_messages')
    .delete()
    .eq('id', messageId);

  if (error) throw new Error(error.message);
};
