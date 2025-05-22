import React from 'react';
import { Pressable } from 'react-native';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { Link, LinkText } from '../ui/link';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { useDisclose } from '@gluestack-ui/hooks';
import { EditProfileDrawer } from './EditProfileDrawer';
import { useTranslation } from '@/hooks/useTranslation';
import { useProfile } from '@/hooks/useProfile';

interface ProfileCardProps {
  user: SupabaseUser | null;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const {
    isOpen: isActionsheetOpen,
    onOpen: onOpenActionsheet,
    onClose: onCloseActionsheet,
  } = useDisclose(false);

  const { data: profile } = useProfile();
  const { t } = useTranslation();

  return (
    <>
      <HStack>
        <Pressable
          className="flex flex-1 flex-row justify-start"
          onPress={onOpenActionsheet}>
          <HStack space="md" className="justify-end">
            <Avatar className="bg-primary-500">
              <AvatarFallbackText>{profile?.display_name}</AvatarFallbackText>
              {profile?.avatar_url && (
                <AvatarImage
                  source={{
                    uri: profile?.avatar_url,
                  }}
                />
              )}
            </Avatar>
            <VStack>
              <Text>{profile?.display_name}</Text>
              <Link>
                <LinkText
                  size="sm"
                  className="text-typography-500 no-underline hover:text-typography-500 active:text-typography-500">
                  {t('profile.drawer_title')}
                </LinkText>
              </Link>
            </VStack>
          </HStack>
        </Pressable>
      </HStack>
      <EditProfileDrawer
        isOpen={isActionsheetOpen}
        user={user}
        onClose={onCloseActionsheet}
      />
    </>
  );
};
