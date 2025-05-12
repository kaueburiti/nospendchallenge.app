import React from 'react';
import { Pressable } from 'react-native';
import { HStack } from '../ui/hstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { Badge } from '@/components/ui/badge';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { useProfile } from '@/hooks/useProfile';
import { router } from 'expo-router';

interface ProfileCardProps {
  user: SupabaseUser | null;
}

export const ProfileCard: React.FC<ProfileCardProps> = () => {
  const { data: profile } = useProfile();
  const hasToUpdateProfile = !!(profile?.display_name ?? profile?.avatar_url);

  return (
    <HStack>
      <Pressable onPress={() => router.push('/profile')} className="relative">
        {hasToUpdateProfile && (
          <Badge
            className="absolute bottom-0 left-0 z-10 h-4 w-4 rounded-full bg-error-500 text-center"
            variant="solid"
          />
        )}
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
      </Pressable>
    </HStack>
  );
};
