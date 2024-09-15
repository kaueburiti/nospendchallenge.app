import React from 'react';
import { Pressable } from 'react-native';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { Link, LinkText } from '../ui/link';
import { Icon } from '../ui/icon';
import { ChevronRight } from 'lucide-react-native';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '../ui/avatar';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { useDisclose } from '@gluestack-ui/hooks';
import { EditProfileDrawer } from './EditProfileDrawer';
import { useUpdateUserProfile } from '@/hooks/auth/useUpdateUserProfile';

interface ProfileCardProps {
  user: SupabaseUser | null;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const {
    isOpen: isActionsheetOpen,
    onOpen: onOpenActionsheet,
    onClose: onCloseActionsheet,
  } = useDisclose(false);

  const { updateUserProfile, isLoading } = useUpdateUserProfile();

  const handleUpdateUser = async (
    userData: Partial<SupabaseUser['user_metadata']>,
  ) => {
    await updateUserProfile({ data: userData });
  };

  return (
    <>
      <HStack>
        <Pressable
          className={'flex-1 flex flex-row justify-between items-center'}
          onPress={onOpenActionsheet}>
          <HStack space="md">
            <Avatar className="bg-primary-500">
              <AvatarFallbackText>
                {user?.user_metadata.full_name}
              </AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: user?.user_metadata.avatar_url as string,
                }}
              />
            </Avatar>
            <VStack>
              <Text>{user?.user_metadata.full_name}</Text>
              <Link>
                <LinkText
                  size="sm"
                  className="text-typography-500 no-underline hover:text-typography-500 active:text-typography-500">
                  Edit Profile
                </LinkText>
              </Link>
            </VStack>
          </HStack>
          <Icon as={ChevronRight} />
        </Pressable>
      </HStack>
      <EditProfileDrawer
        isOpen={isActionsheetOpen}
        user={user}
        onClose={onCloseActionsheet}
        onSave={handleUpdateUser}
        isLoading={isLoading}
      />
    </>
  );
};
