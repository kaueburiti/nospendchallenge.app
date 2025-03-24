import type { IMessage, User as GiftedUser } from 'react-native-gifted-chat';

export interface Profile {
  id: string;
  display_name?: string;
  avatar_url?: string;
}

export interface DBChatMessage {
  id: string;
  challenge_id: number;
  message: string;
  created_at: string;
  updated_at: string | null;
  profile_id: string;
  profiles: Profile;
}

export interface ChatMessage extends IMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: GiftedUser;
  image?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
}

export interface SendMessageParams {
  challengeId: string;
  message: string;
}

export interface UpdateMessageParams {
  messageId: string;
  message: string;
}
